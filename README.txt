MAYAACC - Windows app (.exe) project
====================================
Aapko kuch install ya terminal me type nahi karna. GitHub apne aap .exe bana dega.

1. github.com par free account banao -> "New repository" -> naam: mayaacc (Private rakh sakte ho).
2. Is folder (mayaacc-desktop) ke andar ki saari files/folders repo me "Upload files" se daal do.
   (".github" folder bhi jana chahiye - agar hidden dikhe to Windows me View -> Hidden items ON karo.)
3. Repo ke upar "Actions" tab kholo -> "Build Windows installer" -> "Run workflow".
   Pehli baar "I understand my workflows" wala button aaye to dabao.
4. 5-8 minute baad run complete hoga -> uske andar "Artifacts" me MAYAACC-Windows download karo (zip).
5. Zip me 2 file milengi:
   - MAYAACC-1.0.0-nsis.exe      -> installer (Desktop icon + Start menu)
   - MAYAACC-1.0.0-portable.exe  -> bina install chalne wali (pen drive ke liye)

Note
- Windows pehli baar "Unknown publisher / SmartScreen" dikha sakta hai (kyunki app signed nahi hai).
  "More info" -> "Run anyway" dabao. Baad me code-signing certificate lene par ye hat jata hai.
- App ka data Windows ke user folder me rehta hai. Phir bhi Data -> Schedule Backup -> Choose folder
  se backup folder set karo; app band karte waqt bhi last backup us folder me save hota hai.
