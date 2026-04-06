import os
from dotenv import load_dotenv
from supabase import create_client, Client

# Load environment variables
load_dotenv()

# ─── Fix: Clear corrupted system proxy env vars ──────────────────────────────
# Some machines have HTTP_PROXY / HTTPS_PROXY / ALL_PROXY set to garbage values
# (e.g. a PHP Composer install command). httpx reads these automatically and
# crashes with "Unknown scheme for proxy URL". Unset them before client init.
for _proxy_var in ("HTTP_PROXY", "HTTPS_PROXY", "ALL_PROXY",
                   "http_proxy", "https_proxy", "all_proxy"):
    os.environ.pop(_proxy_var, None)
# ─────────────────────────────────────────────────────────────────────────────

SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("WARNING: Supabase credentials missing from .env")

# Initialize the Supabase client
supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
