import os
from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_ANON_KEY = os.getenv("SUPABASE_ANON_KEY")

if not SUPABASE_URL or not SUPABASE_ANON_KEY:
    # Create a dummy client-like object to avoid crashes in local dev
    class _Dummy:
        def table(self, *_args, **_kwargs): 
            class _Exec:
                def insert(self, data): 
                    class _R: 
                        def execute(self): 
                            return type("Res", (), {"data": [data]})()
                    return _R()
            return _Exec()
    supabase_client: Client = _Dummy()  # type: ignore
else:
    supabase_client: Client = create_client(SUPABASE_URL, SUPABASE_ANON_KEY)
