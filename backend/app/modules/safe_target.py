import ipaddress
import socket
import urllib.request
from urllib.parse import urlparse


# Stops scans from being tricked into visiting localhost, 10.x, 169.254.x or other internal machines.
def points_to_private_address(host):
    if not host:
        return True
    try:
        addressInfos = socket.getaddrinfo(host, None)
    except socket.gaierror:
        return False
    try:
        return any(not ipaddress.ip_address(info[4][0]).is_global for info in addressInfos)
    except ValueError:
        return True


# Re-checks every redirect, because a public site can redirect to an internal address.
class PublicOnlyRedirectHandler(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, request, fp, code, message, headers, newUrl):
        if points_to_private_address(urlparse(newUrl).hostname):
            raise ValueError("Redirect to a non-public address was blocked")
        return super().redirect_request(request, fp, code, message, headers, newUrl)