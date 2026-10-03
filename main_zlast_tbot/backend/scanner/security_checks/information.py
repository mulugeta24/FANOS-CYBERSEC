"""
Information Disclosure & Server Exposure Assessment Engine
Audits server banners, framework headers, stack traces, directory listings, and sensitive file exposures.
"""
import re
import uuid
import httpx
from urllib.parse import urljoin

SENSITIVE_PATHS = [
    {'path': '/.env', 'sig': r'DB_PASSWORD|APP_KEY|SECRET_KEY|DATABASE_URL', 'name': 'Exposed Environment File (.env)', 'severity': 'Critical'},
    {'path': '/.git/HEAD', 'sig': r'ref: refs/heads/', 'name': 'Exposed Git Repository Metadata (/.git/HEAD)', 'severity': 'High'},
    {'path': '/robots.txt', 'sig': r'User-agent:', 'name': 'Robots.txt Analysis', 'severity': 'Informational'},
]

def check_information_exposure(target_url: str, headers: dict, html_content: str, allow_probes: bool = True) -> list[dict]:
    """
    Evaluates HTTP responses for information leakage and verifies common sensitive endpoints.
    """
    findings = []
    headers_lower = {k.lower(): v for k, v in headers.items()}

    # 1. Server Header Disclosure (Version Disclosure)
    server = headers_lower.get('server')
    if server:
        has_version = bool(re.search(r'\d+\.\d+', server))
        if has_version:
            findings.append({
                'id': f"FND-INFO-SERVER-{uuid.uuid4().hex[:8]}",
                'title': f"Web Server Version Disclosed: {server}",
                'severity': "Low",
                'confidence': "Confirmed",
                'category': "Information Exposure",
                'affected_asset': target_url,
                'affected_url': target_url,
                'http_method': "GET",
                'parameter': "Server",
                'description': f"The web server exposes its exact product and version number in the HTTP 'Server' header: '{server}'.",
                'impact': "Attackers can look up known CVEs for the specific version to stage targeted exploits against the unpatched server daemon.",
                'remediation': "Configure the web server to suppress or genericize the Server banner (e.g. 'ServerTokens Prod' in Apache or 'server_tokens off;' in Nginx).",
                'references': [
                    {"title": "CWE-200: Exposure of Sensitive Information to an Unauthorized Actor", "url": "https://cwe.mitre.org/data/definitions/200.html"}
                ],
                'evidence': {
                    'header': 'Server',
                    'observed_value': server
                },
                'scanner_module': "InformationExposureCheck"
            })

    # 2. X-Powered-By Header Disclosure
    powered_by = headers_lower.get('x-powered-by')
    if powered_by:
        findings.append({
            'id': f"FND-INFO-POWERED-{uuid.uuid4().hex[:8]}",
            'title': f"Backend Technology Disclosed: X-Powered-By: {powered_by}",
            'severity': "Low",
            'confidence': "Confirmed",
            'category': "Information Exposure",
            'affected_asset': target_url,
            'affected_url': target_url,
            'http_method': "GET",
            'parameter': "X-Powered-By",
            'description': f"The application announces its underlying programming language or runtime: '{powered_by}'.",
            'impact': "Reveals application framework stack, narrowing attacker reconnaissance for specialized framework injection vectors.",
            'remediation': "Disable the X-Powered-By header in application settings (e.g. app.disable('x-powered-by') in Express or 'expose_php = Off' in php.ini).",
            'references': [
                {"title": "CWE-200: Information Exposure", "url": "https://cwe.mitre.org/data/definitions/200.html"}
            ],
            'evidence': {
                'header': 'X-Powered-By',
                'observed_value': powered_by
            },
            'scanner_module': "InformationExposureCheck"
        })

    # 3. Stack Trace / Internal Debugger Disclosures in Body
    if html_content:
        error_patterns = [
            (r'Traceback \(most recent call last\):', 'Python / Django Stack Trace'),
            (r'Fatal error:.*in .*\.php on line \d+', 'PHP Fatal Error Disclosure'),
            (r'Microsoft VBScript runtime error', 'Classic ASP / VBScript Runtime Error'),
            (r'org\.apache\.catalina\.core\.StandardWrapper', 'Tomcat / Java Servlet Exception Trace'),
            (r'SQLSTATE\[[0-9A-Z]+\]', 'Database SQL Error Disclosure'),
        ]
        for pattern, desc in error_patterns:
            if re.search(pattern, html_content, re.IGNORECASE):
                findings.append({
                    'id': f"FND-INFO-TRACE-{uuid.uuid4().hex[:8]}",
                    'title': f"Application Debug Error / Stack Trace Disclosed ({desc})",
                    'severity': "Medium",
                    'confidence': "High confidence",
                    'category': "Information Exposure",
                    'affected_asset': target_url,
                    'affected_url': target_url,
                    'http_method': "GET",
                    'parameter': "Response Body",
                    'description': f"The application response contained diagnostic debug indicators matching {desc}.",
                    'impact': "Internal system file paths, database structure, and source code excerpts are revealed to unauthenticated users.",
                    'remediation': "Disable debug mode in production environment settings and configure generic custom error pages (e.g. HTTP 500 handler).",
                    'references': [
                        {"title": "CWE-209: Generation of Error Message Containing Sensitive Information", "url": "https://cwe.mitre.org/data/definitions/209.html"}
                    ],
                    'evidence': {
                        'matched_pattern': desc,
                        'excerpt': html_content[:200].strip()
                    },
                    'scanner_module': "InformationExposureCheck"
                })
                break

    # 4. Safe Sensitive Path Verification (Probe common config indicators if permitted)
    if allow_probes:
        headers_probe = {'User-Agent': 'Fanos-SecurityScanner/2.4'}
        try:
            with httpx.Client(headers=headers_probe, timeout=4.0, follow_redirects=False, verify=False) as client:
                for item in SENSITIVE_PATHS:
                    probe_url = urljoin(target_url, item['path'])
                    try:
                        r = client.get(probe_url)
                        if r.status_code == 200 and re.search(item['sig'], r.text):
                            findings.append({
                                'id': f"FND-INFO-PATH-{uuid.uuid4().hex[:8]}",
                                'title': item['name'],
                                'severity': item['severity'],
                                'confidence': "Confirmed",
                                'category': "Information Exposure",
                                'affected_asset': target_url,
                                'affected_url': probe_url,
                                'http_method': "GET",
                                'parameter': item['path'],
                                'description': f"The sensitive file at '{item['path']}' was publicly reachable with HTTP status 200.",
                                'impact': "Directly leaks configuration secrets, source code metadata, or system layout to any external visitor.",
                                'remediation': f"Block public web server access to '{item['path']}' or relocate it outside the public web document root.",
                                'references': [
                                    {"title": "CWE-552: Files or Directories Accessible to External Parties", "url": "https://cwe.mitre.org/data/definitions/552.html"}
                                ],
                                'evidence': {
                                    'url': probe_url,
                                    'status_code': 200,
                                    'snippet': "[REDACTED_CONTENT_MATCH]"
                                },
                                'scanner_module': "InformationExposureCheck"
                            })
                    except Exception:
                        pass
        except Exception:
            pass

    return findings
