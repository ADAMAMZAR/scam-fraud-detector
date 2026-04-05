import os
from dotenv import load_dotenv
load_dotenv()
from supabase import create_client

sb = create_client(os.environ["SUPABASE_URL"], os.environ["SUPABASE_ANON_KEY"])

scans = sb.table("scans").select("id, verdict, channel").execute()
reasons = sb.table("scan_reasons").select("id").execute()

print(f"Scans in DB:   {len(scans.data)}")
print(f"Reasons in DB: {len(reasons.data)}")
print()
for s in scans.data:
    print(f"  [{s['verdict']:10}] channel={s['channel']}")
