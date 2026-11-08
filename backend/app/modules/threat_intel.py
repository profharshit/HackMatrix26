# STUB: fake data matching the contract until Account C's real lookup is ready
def get_threat_intel(domain):
    return {
        "score": 70,
        "reports": 2,
        "feeds_hit": ["FakeFeed"],
        "details": {"domain": domain},
    }
