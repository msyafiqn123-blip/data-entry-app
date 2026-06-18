$f1="C:\Users\msyaf\.gemini\antigravity\scratch\data-entry-app\src\app\dashboard\spop\page.tsx"
$c1=Get-Content -Path $f1 -Raw
$c1=$c1 -replace 'bg-white', 'bg-[var(--input-bg)] text-[var(--text-primary)]'
$c1=$c1 -replace 'text-slate-800', 'text-[var(--text-primary)]'
$c1=$c1 -replace 'text-slate-700', 'text-[var(--text-primary)]'
$c1=$c1 -replace 'text-slate-500', 'text-[var(--text-secondary)]'
$c1=$c1 -replace 'bg-slate-50', 'bg-[var(--section-bg)]'
$c1=$c1 -replace 'bg-slate-100', 'bg-[var(--section-bg)]'
$c1=$c1 -replace 'border-slate-200', 'border-[var(--border)]'
$c1=$c1 -replace 'border-slate-300', 'border-[var(--border)]'
$c1=$c1 -replace 'bg-\[var\(--input-bg\)\] text-\[var\(--text-primary\)\] rounded-xl', 'bg-[var(--card-bg)] rounded-[var(--radius-lg)]'
Set-Content -Path $f1 -Value $c1

$f2="C:\Users\msyaf\.gemini\antigravity\scratch\data-entry-app\src\app\dashboard\lspop\page.tsx"
$c2=Get-Content -Path $f2 -Raw
$c2=$c2 -replace 'bg-white', 'bg-[var(--input-bg)] text-[var(--text-primary)]'
$c2=$c2 -replace 'text-slate-800', 'text-[var(--text-primary)]'
$c2=$c2 -replace 'text-slate-700', 'text-[var(--text-primary)]'
$c2=$c2 -replace 'text-slate-500', 'text-[var(--text-secondary)]'
$c2=$c2 -replace 'bg-slate-50', 'bg-[var(--section-bg)]'
$c2=$c2 -replace 'bg-slate-100', 'bg-[var(--section-bg)]'
$c2=$c2 -replace 'border-slate-200', 'border-[var(--border)]'
$c2=$c2 -replace 'border-slate-300', 'border-[var(--border)]'
$c2=$c2 -replace 'bg-\[var\(--input-bg\)\] text-\[var\(--text-primary\)\] rounded-xl', 'bg-[var(--card-bg)] rounded-[var(--radius-lg)]'
Set-Content -Path $f2 -Value $c2

$f3="C:\Users\msyaf\.gemini\antigravity\scratch\data-entry-app\src\app\dashboard\admin\spop\[id]\page.tsx"
$c3=Get-Content -Path $f3 -Raw
$c3=$c3 -replace 'bg-white', 'bg-[var(--input-bg)] text-[var(--text-primary)]'
$c3=$c3 -replace 'text-slate-800', 'text-[var(--text-primary)]'
$c3=$c3 -replace 'text-slate-700', 'text-[var(--text-primary)]'
$c3=$c3 -replace 'text-slate-500', 'text-[var(--text-secondary)]'
$c3=$c3 -replace 'bg-slate-50', 'bg-[var(--section-bg)]'
$c3=$c3 -replace 'bg-slate-100', 'bg-[var(--section-bg)]'
$c3=$c3 -replace 'border-slate-200', 'border-[var(--border)]'
$c3=$c3 -replace 'border-slate-300', 'border-[var(--border)]'
$c3=$c3 -replace 'bg-\[var\(--input-bg\)\] text-\[var\(--text-primary\)\] rounded-xl', 'bg-[var(--card-bg)] rounded-[var(--radius-lg)]'
Set-Content -Path $f3 -Value $c3

$f4="C:\Users\msyaf\.gemini\antigravity\scratch\data-entry-app\src\app\dashboard\admin\lspop\[id]\page.tsx"
$c4=Get-Content -Path $f4 -Raw
$c4=$c4 -replace 'bg-white', 'bg-[var(--input-bg)] text-[var(--text-primary)]'
$c4=$c4 -replace 'text-slate-800', 'text-[var(--text-primary)]'
$c4=$c4 -replace 'text-slate-700', 'text-[var(--text-primary)]'
$c4=$c4 -replace 'text-slate-500', 'text-[var(--text-secondary)]'
$c4=$c4 -replace 'bg-slate-50', 'bg-[var(--section-bg)]'
$c4=$c4 -replace 'bg-slate-100', 'bg-[var(--section-bg)]'
$c4=$c4 -replace 'border-slate-200', 'border-[var(--border)]'
$c4=$c4 -replace 'border-slate-300', 'border-[var(--border)]'
$c4=$c4 -replace 'bg-\[var\(--input-bg\)\] text-\[var\(--text-primary\)\] rounded-xl', 'bg-[var(--card-bg)] rounded-[var(--radius-lg)]'
Set-Content -Path $f4 -Value $c4
