<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture
- FUNLOC SIG is a single-page app at src/routes/index.tsx with three tab views (Dashboard, Funcloc, Cost Center) in src/components/. Keep it single-route unless the user asks for separate pages.
- Data comes from the user-owned external Supabase project (table "Funloc All SIG") via src/lib/supabase.ts with runtime config stored in localStorage (Setting modal). Do not migrate this data into Lovable Cloud or replace the client; the anon key in code is publishable by design.
- UI uses skeuomorphic chrome/silver styles (skeuo-* classes) defined at the bottom of src/styles.css with Plus Jakarta Sans; preserve this visual direction.
