'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabase';
import { LogOut, Clock, TrendingUp, BarChart3, Table2, User, Upload } from 'lucide-react';
import * as XLSX from 'xlsx';

type CalculationRow = {
  id: string;
  title: string;
  type: string;
  location: string;
  input_data: any;
  result_data: any;
  created_at?: string;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

const round2 = (value: number) => Math.round(value * 100) / 100;

const getDate = (value: any) => {
  if (!value) return null;

  if (typeof value === 'number') {
    const parsed = XLSX.SSF.parse_date_code(value);
    if (!parsed) return null;
    return new Date(parsed.y, parsed.m - 1, parsed.d);
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const diffInDays = (dateFin: any, dateDebut: any) => {
  const fin = getDate(dateFin);
  const debut = getDate(dateDebut);
  if (!fin || !debut) return null;
  return Math.ceil((fin.getTime() - debut.getTime()) / MS_PER_DAY);
};

const average = (values: number[]) => {
  const positiveValues = values.filter((value) => Number.isFinite(value) && value >= 0);
  if (positiveValues.length === 0) return null;
  return round2(positiveValues.reduce((sum, value) => sum + value, 0) / positiveValues.length);
};

export default function Dashboard() {
  const router = useRouter();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedKPI, setSelectedKPI] = useState<string | null>(null);
  const [selectedSite, setSelectedSite] = useState('CPSM');
  const [refreshKey, setRefreshKey] = useState(0);

  const sites = ['CPSM', 'ATF', 'HPE', 'CIOC', 'CIOJ', 'Autre'];

  const displayName =
    user?.user_metadata?.full_name ||
    user?.user_metadata?.name ||
    user?.email?.split('@')[0] ||
    'Utilisateur';

  useEffect(() => {
    const checkUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user) {
        router.replace('/');
        return;
      }

      setUser(session.user);
      setLoading(false);
    };

    checkUser();
  }, [router]);

  const logout = async () => {
    await supabase.auth.signOut();
    router.replace('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-2xl text-slate-800">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-sky-200 flex overflow-hidden text-slate-800">
      <div className="w-80 bg-white shadow-2xl border-r border-blue-100 flex-shrink-0">
        <div className="p-8 border-b border-blue-100">
          <h1 className="text-4xl font-black bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            AKDICAL
          </h1>
          <p className="text-slate-600 mt-1 font-medium">Suivi Achats</p>
        </div>

        <div className="p-6 space-y-3">
          {[
            { name: 'Délai de traitement Acheteur', icon: Clock },
            { name: 'Taux de Saving', icon: TrendingUp },
            { name: 'Délai de traitement Global', icon: BarChart3 },
            { name: 'Tableau de présentation', icon: Table2 },
            { name: 'Importer Excel', icon: Upload },
          ].map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                onClick={() => setSelectedKPI(item.name)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl transition-all text-lg font-semibold ${
                  selectedKPI === item.name
                    ? 'bg-blue-700 text-white shadow-lg'
                    : 'hover:bg-blue-50 text-slate-700'
                }`}
              >
                <Icon size={24} />
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 p-8 overflow-auto">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl font-black text-slate-900">
                {selectedKPI || 'Tableau de présentation'}
              </h2>

              <div className="mt-3 inline-flex items-center gap-2 bg-white/80 border border-blue-200 rounded-2xl px-4 py-2 shadow-sm">
                <User size={18} className="text-blue-700" />
                <p className="text-slate-700 font-medium">
                  Connecté en tant que{' '}
                  <span className="font-bold text-blue-800">{displayName}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <select
                value={selectedSite}
                onChange={(e) => setSelectedSite(e.target.value)}
                className="px-6 py-3 rounded-2xl border border-blue-200 bg-white text-slate-800 font-bold shadow-sm outline-none focus:ring-2 focus:ring-blue-400"
              >
                {sites.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                onClick={logout}
                className="flex items-center gap-2 text-red-600 font-bold bg-white hover:bg-red-50 px-5 py-3 rounded-2xl border border-red-100 shadow-sm"
              >
                <LogOut size={20} />
                Déconnexion
              </button>
            </div>
          </div>

          <DynamicForm
            kpi={selectedKPI || 'Tableau de présentation'}
            site={selectedSite}
            user={user}
            refreshKey={refreshKey}
            onSaved={() => setRefreshKey((key) => key + 1)}
          />
        </div>
      </div>
    </div>
  );
}

function DynamicForm({ kpi, site, user, onSaved, refreshKey }: any) {
  if (kpi === 'Délai de traitement Acheteur') {
    return <DelaiAcheteur user={user} site={site} onSaved={onSaved} />;
  }

  if (kpi === 'Taux de Saving') {
    return <TauxSaving user={user} site={site} onSaved={onSaved} />;
  }

  if (kpi === 'Délai de traitement Global') {
    return <DelaiGlobal user={user} site={site} onSaved={onSaved} />;
  }

  if (kpi === 'Importer Excel') {
    return <ExcelImporter user={user} site={site} onSaved={onSaved} />;
  }

  return <PresentationTable site={site} refreshKey={refreshKey} />;
}

function DelaiAcheteur({ user, site, onSaved }: any) {
  const [title, setTitle] = useState('');
  const [dateCreationBonCommande, setDateCreationBonCommande] = useState('');
  const [dateVal1, setDateVal1] = useState('');
  const [dateVal2, setDateVal2] = useState('');
  const [dateVal3, setDateVal3] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const validations = [dateVal1, dateVal2, dateVal3].map(getDate).filter(Boolean) as Date[];

    if (!dateCreationBonCommande || validations.length === 0) {
      return alert('Remplis la date création bon de commande et au moins une date de validation');
    }

    const derniereValidation = new Date(Math.max(...validations.map((d) => d.getTime())));
    const days = diffInDays(dateCreationBonCommande, derniereValidation);

    if (days === null) return alert('Dates invalides');
    if (days < 0) return alert('Résultat négatif : vérifie les dates');

    setResult(days);
  };

  const save = async () => {
    if (result === null || !title) return alert('Remplis le titre');

    await supabase.from('calculations').insert({
      user_id: user?.id,
      title,
      type: 'Délai de traitement Acheteur',
      location: site,
      input_data: { dateCreationBonCommande, dateVal1, dateVal2, dateVal3 },
      result_data: { delai_acheteur_jours: result },
    });

    alert('✅ Sauvegardé !');
    setTitle('');
    setDateCreationBonCommande('');
    setDateVal1('');
    setDateVal2('');
    setDateVal3('');
    setResult(null);
    onSaved?.();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100">
      <h3 className="text-2xl font-black mb-8 text-slate-900">Délai de traitement Acheteur</h3>

      <input
        type="text"
        placeholder="Titre du calcul"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 border border-blue-200 rounded-2xl mb-6 text-slate-800"
      />

      <div className="grid grid-cols-2 gap-6">
        <DateInput label="Date création bon de commande" value={dateCreationBonCommande} setValue={setDateCreationBonCommande} />
        <DateInput label="Date validation 1" value={dateVal1} setValue={setDateVal1} />
        <DateInput label="Date validation 2" value={dateVal2} setValue={setDateVal2} />
        <DateInput label="Date validation 3" value={dateVal3} setValue={setDateVal3} />
      </div>

      <button onClick={calculate} className="mt-8 w-full bg-blue-700 text-white py-5 rounded-2xl font-bold">
        Calculer
      </button>

      {result !== null && (
        <ResultBox value={`${result} jours`} onSave={save} />
      )}
    </div>
  );
}

function TauxSaving({ user, site, onSaved }: any) {
  const [title, setTitle] = useState('');
  const [achatTtc, setAchatTtc] = useState('');
  const [economie, setEconomie] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const achat = Number(achatTtc);
    const saving = Number(economie);

    if (!achatTtc || !economie) return alert('Remplis les deux montants');
    if (achat <= 0) return alert("La valeur d'achat TTC doit être supérieure à 0");

    const percent = round2((saving / achat) * 100);
    if (percent < 0) return alert('Résultat négatif : vérifie les montants');

    setResult(percent);
  };

  const save = async () => {
    if (result === null || !title) return alert('Remplis le titre');

    await supabase.from('calculations').insert({
      user_id: user?.id,
      title,
      type: 'Taux de Saving',
      location: site,
      input_data: { achatTtc, economie },
      result_data: { saving_percent: result },
    });

    alert('✅ Sauvegardé !');
    setTitle('');
    setAchatTtc('');
    setEconomie('');
    setResult(null);
    onSaved?.();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100">
      <h3 className="text-2xl font-black mb-8 text-slate-900">Taux de Saving (%)</h3>

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 border border-blue-200 rounded-2xl mb-6 text-slate-800"
      />

      <div className="grid grid-cols-2 gap-6">
        <NumberInput label="Valeur d'achat TTC" value={achatTtc} setValue={setAchatTtc} />
        <NumberInput label="Valeur économisée" value={economie} setValue={setEconomie} />
      </div>

      <button onClick={calculate} className="mt-8 w-full bg-blue-700 text-white py-5 rounded-2xl font-bold">
        Calculer %
      </button>

      {result !== null && (
        <ResultBox value={`${result}%`} onSave={save} />
      )}
    </div>
  );
}

function DelaiGlobal({ user, site, onSaved }: any) {
  const [title, setTitle] = useState('');
  const [dateCreation, setDateCreation] = useState('');
  const [dateValidationBudgetaire, setDateValidationBudgetaire] = useState('');
  const [result, setResult] = useState<number | null>(null);

  const calculate = () => {
    const days = diffInDays(dateValidationBudgetaire, dateCreation);

    if (days === null) return alert('Remplis les deux dates');
    if (days < 0) return alert('Résultat négatif : vérifie les dates');

    setResult(days);
  };

  const save = async () => {
    if (result === null || !title) return alert('Remplis le titre');

    await supabase.from('calculations').insert({
      user_id: user?.id,
      title,
      type: 'Délai de traitement Global',
      location: site,
      input_data: { dateValidationBudgetaire, dateCreation },
      result_data: { delai_global_jours: result },
    });

    alert('✅ Sauvegardé !');
    setTitle('');
    setDateCreation('');
    setDateValidationBudgetaire('');
    setResult(null);
    onSaved?.();
  };

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100">
      <h3 className="text-2xl font-black mb-8 text-slate-900">Délai de traitement Global</h3>

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full p-4 border border-blue-200 rounded-2xl mb-6 text-slate-800"
      />

      <div className="grid grid-cols-2 gap-6">
        <DateInput label="Date de création" value={dateCreation} setValue={setDateCreation} />
        <DateInput label="Date de validation budgétaire" value={dateValidationBudgetaire} setValue={setDateValidationBudgetaire} />
      </div>

      <button onClick={calculate} className="mt-8 w-full bg-blue-700 text-white py-5 rounded-2xl font-bold">
        Calculer
      </button>

      {result !== null && (
        <ResultBox value={`${result} jours`} onSave={save} />
      )}
    </div>
  );
}

function ExcelImporter({ user, site, onSaved }: any) {
  const [resultats, setResultats] = useState<any[]>([]);

  const readExcel = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: 'array' });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet);

      const calculated = jsonData
        .map((row: any, index: number) => {
          const validations = [row['Date val 1'], row['Date val 2'], row['Date val 3']]
            .map(getDate)
            .filter(Boolean) as Date[];

          const derniereValidation =
            validations.length > 0
              ? new Date(Math.max(...validations.map((d) => d.getTime())))
              : null;

          const delaiAcheteur =
            derniereValidation && row['Date création bon de commande']
              ? diffInDays(row['Date création bon de commande'], derniereValidation)
              : null;

          const achat = Number(row["Valeur d'achat TTC"] || 0);
          const economie = Number(row['Valeur économisée'] || 0);

          const saving = achat > 0 ? round2((economie / achat) * 100) : null;

          const delaiGlobal =
            row['Date validation budgétaire'] && row['Date création']
              ? diffInDays(row['Date validation budgétaire'], row['Date création'])
              : null;

          return {
            ligne: index + 2,
            titre: row['Titre'] || `Ligne ${index + 2}`,
            delaiAcheteur,
            saving,
            delaiGlobal,
          };
        })
        .filter((r: any) =>
          (r.delaiAcheteur === null || r.delaiAcheteur >= 0) &&
          (r.saving === null || r.saving >= 0) &&
          (r.delaiGlobal === null || r.delaiGlobal >= 0)
        );

      setResultats(calculated);
    };

    reader.readAsArrayBuffer(file);
  };

  const saveAll = async () => {
    if (resultats.length === 0) return alert('Aucune donnée à sauvegarder');

    const inserts = resultats.flatMap((row) => {
      const data = [];

      if (row.delaiAcheteur !== null) {
        data.push({
          user_id: user?.id,
          title: row.titre,
          type: 'Délai de traitement Acheteur',
          location: site,
          input_data: { source: 'excel', ligne: row.ligne },
          result_data: { delai_acheteur_jours: row.delaiAcheteur },
        });
      }

      if (row.saving !== null) {
        data.push({
          user_id: user?.id,
          title: row.titre,
          type: 'Taux de Saving',
          location: site,
          input_data: { source: 'excel', ligne: row.ligne },
          result_data: { saving_percent: row.saving },
        });
      }

      if (row.delaiGlobal !== null) {
        data.push({
          user_id: user?.id,
          title: row.titre,
          type: 'Délai de traitement Global',
          location: site,
          input_data: { source: 'excel', ligne: row.ligne },
          result_data: { delai_global_jours: row.delaiGlobal },
        });
      }

      return data;
    });

    const { error } = await supabase.from('calculations').insert(inserts);

    if (error) {
      alert('Erreur pendant la sauvegarde');
      return;
    }

    alert('✅ Données Excel sauvegardées !');
    setResultats([]);
    onSaved?.();
  };

  const moyenneAcheteur = average(resultats.map((r) => Number(r.delaiAcheteur)));
  const moyenneSaving = average(resultats.map((r) => Number(r.saving)));
  const moyenneGlobal = average(resultats.map((r) => Number(r.delaiGlobal)));

  return (
    <div className="bg-white rounded-3xl shadow-xl p-10 border border-blue-100">
      <h3 className="text-3xl font-black text-slate-900 mb-3">Importer Excel</h3>

      <p className="text-slate-600 mb-8 font-medium">
        Clique sur le bouton, choisis ton fichier Excel, puis les KPI seront calculés automatiquement.
      </p>

      <label className="w-full flex items-center justify-center gap-3 bg-blue-700 hover:bg-blue-800 text-white py-5 rounded-2xl font-bold cursor-pointer shadow-lg">
        <Upload size={24} />
        Importer un fichier Excel
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) readExcel(file);
          }}
        />
      </label>

      {resultats.length > 0 && (
        <>
          <div className="grid grid-cols-3 gap-6 mt-8">
            <AverageCard title="Moyenne délai acheteur" value={moyenneAcheteur} suffix="jours" />
            <AverageCard title="Moyenne saving" value={moyenneSaving} suffix="%" />
            <AverageCard title="Moyenne délai global" value={moyenneGlobal} suffix="jours" />
          </div>

          <div className="overflow-x-auto mt-10">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700">
                  <th className="py-4">Ligne</th>
                  <th className="py-4">Titre</th>
                  <th className="py-4">Délai Acheteur</th>
                  <th className="py-4">Saving</th>
                  <th className="py-4">Délai Global</th>
                </tr>
              </thead>

              <tbody>
                {resultats.map((row) => (
                  <tr key={row.ligne} className="border-b border-slate-200">
                    <td className="py-4 font-bold">{row.ligne}</td>
                    <td className="py-4 font-bold">{row.titre}</td>
                    <td className="py-4">{row.delaiAcheteur ?? '-'} jours</td>
                    <td className="py-4">{row.saving ?? '-'}%</td>
                    <td className="py-4">{row.delaiGlobal ?? '-'} jours</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <button
            onClick={saveAll}
            className="mt-8 w-full bg-emerald-700 hover:bg-emerald-800 text-white py-5 rounded-2xl font-bold"
          >
            Sauvegarder toutes les données Excel
          </button>
        </>
      )}
    </div>
  );
}

function PresentationTable({ site, refreshKey }: any) {
  const [rows, setRows] = useState<CalculationRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRows = async () => {
      setLoading(true);

      const { data, error } = await supabase
        .from('calculations')
        .select('*')
        .eq('location', site)
        .order('created_at', { ascending: false });

      if (error) {
        setRows([]);
      } else {
        setRows((data || []).filter((row: CalculationRow) => {
          const result = getMainResult(row);
          return result !== null && Number(result) >= 0;
        }));
      }

      setLoading(false);
    };

    fetchRows();
  }, [site, refreshKey]);

  const stats = useMemo(() => ({
    delaiAcheteur: average(rows.filter((r) => r.type === 'Délai de traitement Acheteur').map((r) => Number(r.result_data?.delai_acheteur_jours))),
    saving: average(rows.filter((r) => r.type === 'Taux de Saving').map((r) => Number(r.result_data?.saving_percent))),
    delaiGlobal: average(rows.filter((r) => r.type === 'Délai de traitement Global').map((r) => Number(r.result_data?.delai_global_jours))),
  }), [rows]);

  if (loading) {
    return <div className="bg-white rounded-3xl shadow-xl p-10">Chargement du tableau...</div>;
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-3 gap-6">
        <AverageCard title="Moyenne délai acheteur" value={stats.delaiAcheteur} suffix="jours" />
        <AverageCard title="Moyenne saving" value={stats.saving} suffix="%" />
        <AverageCard title="Moyenne délai global" value={stats.delaiGlobal} suffix="jours" />
      </div>

      <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
        <h3 className="text-2xl font-black mb-6 text-slate-900">
          Tableau de présentation - {site}
        </h3>

        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-slate-300 text-slate-700">
              <th className="py-3">Titre</th>
              <th className="py-3">KPI</th>
              <th className="py-3">Site</th>
              <th className="py-3">Résultat</th>
              <th className="py-3">Date</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-slate-200">
                <td className="py-4 font-bold">{row.title}</td>
                <td className="py-4">{row.type}</td>
                <td className="py-4">{row.location}</td>
                <td className="py-4 font-black text-blue-800">{formatResult(row)}</td>
                <td className="py-4">
                  {row.created_at ? new Date(row.created_at).toLocaleDateString('fr-FR') : '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DateInput({ label, value, setValue }: any) {
  return (
    <div>
      <label className="font-bold text-slate-700">{label}</label>
      <input
        type="date"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-4 border border-blue-200 rounded-2xl mt-2 text-slate-800"
      />
    </div>
  );
}

function NumberInput({ label, value, setValue }: any) {
  return (
    <div>
      <label className="font-bold text-slate-700">{label}</label>
      <input
        type="number"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="w-full p-4 border border-blue-200 rounded-2xl mt-2 text-slate-800"
      />
    </div>
  );
}

function ResultBox({ value, onSave }: any) {
  return (
    <div className="mt-10 p-10 bg-emerald-50 rounded-3xl text-center border border-emerald-100">
      <p className="text-6xl font-black text-emerald-700">{value}</p>
      <button
        onClick={onSave}
        className="mt-8 bg-emerald-700 hover:bg-emerald-800 text-white px-12 py-4 rounded-2xl font-bold"
      >
        Sauvegarder
      </button>
    </div>
  );
}

function AverageCard({ title, value, suffix }: { title: string; value: number | null; suffix: string }) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8 border border-blue-100">
      <p className="text-slate-600 font-bold mb-3">{title}</p>
      <p className="text-5xl font-black text-blue-700">
        {value === null ? '-' : `${value} ${suffix}`}
      </p>
    </div>
  );
}

function getMainResult(row: CalculationRow) {
  return (
    row.result_data?.delai_acheteur_jours ??
    row.result_data?.delai_jours ??
    row.result_data?.saving_percent ??
    row.result_data?.delai_global_jours ??
    null
  );
}

function formatResult(row: CalculationRow) {
  const value = getMainResult(row);
  if (value === null) return '-';
  if (row.type === 'Taux de Saving') return `${value}%`;
  return `${value} jours`;
}