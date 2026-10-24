import { useEffect, useMemo, useState } from 'react';
import {
  Sprout, LayoutDashboard, Wheat, Droplets, Activity, Search,
  Plus, Trash2, Leaf, Sun, CloudRain, Wind, Menu, X,
  ArrowUpRight, CalendarDays, CheckCircle2, AlertTriangle
} from 'lucide-react';

const API = (
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api'
).replace(/\/$/, '');

const initialCrops = [
  { id: 1, name: 'Tomato', variety: 'Arka Rakshak', area: 1.2, stage: 'Flowering', water: 'Today', health: 'Healthy' },
  { id: 2, name: 'Paddy', variety: 'ADT rice', area: 2.5, stage: 'Vegetative', water: 'Yesterday', health: 'Healthy' },
  { id: 3, name: 'Chilli', variety: 'K1', area: 0.8, stage: 'Fruiting', water: '2 days ago', health: 'Needs attention' },
  { id: 4, name: 'Groundnut', variety: 'TMV 7', area: 1.4, stage: 'Seedling', water: 'Today', health: 'Healthy' }
];

export default function App() {
  const [page, setPage] = useState('Overview');
  const [crops, setCrops] = useState(initialCrops);
  const [demoMode, setDemoMode] = useState(true);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('All crops');
  const [showForm, setShowForm] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({
    name: '', variety: '', area: '', stage: 'Seedling'
  });
  const [irrigation, setIrrigation] = useState({
    field: 'Tomato field', duration: '20', method: 'Drip irrigation'
  });
  const [irrigationLogs, setIrrigationLogs] = useState([
    { id: 1, field: 'Tomato field', duration: 20, method: 'Drip irrigation', date: 'Today, 7:00 AM' },
    { id: 2, field: 'Paddy field', duration: 35, method: 'Flood irrigation', date: 'Yesterday, 6:30 AM' }
  ]);

  // Load crops from the backend when the page opens.
  useEffect(() => {
    async function loadCrops() {
      try {
        const response = await fetch(`${API}/crops`);
        if (!response.ok) throw new Error('Could not load crops');

        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Invalid crop data');

        setCrops(data.map(c => ({ ...c, area: Number(c.area) })));
        setDemoMode(false);
      } catch (error) {
        console.error('Load crops error:', error);
        setDemoMode(true);
      }
    }

    loadCrops();
  }, []);

  const filteredCrops = useMemo(() => {
    return crops.filter(c => {
      const matches = `${c.name} ${c.variety} ${c.stage}`
        .toLowerCase()
        .includes(query.toLowerCase());

      return matches &&
        (filter === 'All crops' || c.health === filter);
    });
  }, [crops, query, filter]);

  function notify(message) {
    setToast(message);
    setTimeout(() => setToast(''), 2600);
  }

  // Add crop to MySQL through the backend.
  async function addCrop(e) {
    e.preventDefault();

    if (
      !form.name.trim() ||
      !form.variety.trim() ||
      Number(form.area) <= 0
    ) {
      notify('Enter valid crop details and area.');
      return;
    }

    const payload = {
      name: form.name.trim(),
      variety: form.variety.trim(),
      area: Number(form.area),
      stage: form.stage,
      water: 'Not logged',
      health: 'Healthy'
    };

    try {
      const response = await fetch(`${API}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`Save failed: ${response.status}`);

      const saved = await response.json();
      setCrops(old => [saved, ...old]);
      setDemoMode(false);
      setForm({ name: '', variety: '', area: '', stage: 'Seedling' });
      setShowForm(false);
      notify('Crop saved to database!');
    } catch (error) {
      console.error('Add crop error:', error);
      notify('Crop not saved. Check backend connection.');
    }
  }

  // Delete crop from the backend first.
  async function deleteCrop(id) {
    try {
      const response = await fetch(`${API}/crops/${id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error(`Delete failed: ${response.status}`);

      setCrops(old => old.filter(c => c.id !== id));
      notify('Crop deleted successfully!');
    } catch (error) {
      console.error('Delete crop error:', error);
      notify('Crop not deleted. Check backend connection.');
    }
  }

  // Update water status in MySQL and then update the screen.
  async function changeWater(crop, newWater) {
    const payload = {
      name: crop.name,
      variety: crop.variety,
      area: Number(crop.area),
      stage: crop.stage,
      water: newWater,
      health: crop.health
    };

    try {
      const response = await fetch(`${API}/crops/${crop.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Water update failed: ${response.status}`);
      }

      const savedCrop = await response.json();

      setCrops(old =>
        old.map(item =>
          item.id === savedCrop.id ? savedCrop : item
        )
      );

      setDemoMode(false);
      notify('Water status saved to database!');
    } catch (error) {
      console.error('Water update error:', error);
      notify('Water status not saved. Check backend/API.');
    }
  }

  // This irrigation history is still local demo data.
  function logWater(e) {
    e.preventDefault();

    const newLog = {
      id: Date.now(),
      ...irrigation,
      duration: Number(irrigation.duration),
      date: new Date().toLocaleString()
    };

    setIrrigationLogs(old => [newLog, ...old]);
    notify('Irrigation activity added to this session.');
  }

  const navItems = [
    { label: 'Overview', icon: LayoutDashboard },
    { label: 'Crop management', icon: Wheat },
    { label: 'Irrigation log', icon: Droplets },
    { label: 'Sensor monitor', icon: Activity }
  ];

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileMenu ? 'sidebar-open' : ''}`}>
        <div className="brand">
          <div className="brand-mark"><Sprout size={23} /></div>
          <div><b>AgriSmart</b><span>FARM INTELLIGENCE</span></div>
          <button className="close-menu" onClick={() => setMobileMenu(false)}>
            <X size={18} />
          </button>
        </div>

        <div className="farm-switch">
          <div className="farm-avatar">GF</div>
          <div><b>Greenfield Farm</b><span>Theni, Tamil Nadu</span></div>
          <span className="switch-dot"></span>
        </div>

        <p className="nav-label">WORKSPACE</p>
        <nav>
          {navItems.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-link ${page === label ? 'active' : ''}`}
              onClick={() => {
                setPage(label);
                setMobileMenu(false);
              }}
            >
              <Icon size={18} />
              <span>{label}</span>
              {label === 'Sensor monitor' && <span className="nav-new">DEMO</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="tip-card">
            <div className="tip-icon"><Leaf size={18} /></div>
            <b>Small steps, better harvests.</b>
            <p>Keep crop records and irrigation logs up to date.</p>
          </div>
          <div className="profile">
            <div className="profile-avatar">AF</div>
            <div><b>Farm manager</b><span>Standard account</span></div>
          </div>
          <span className="profile-more">•••</span>
        </div>
      </aside>

      {mobileMenu && (
        <button
          className="backdrop"
          aria-label="Close menu"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-area">
        <header className="topbar">
          <button className="menu-button" onClick={() => setMobileMenu(true)}>
            <Menu size={21} />
          </button>
          <div className="breadcrumb">
            Workspace <span>/</span> <b>{page}</b>
          </div>
          <div className="top-actions">
            <div className="date-pill">
              <CalendarDays size={15} />
              {new Date().toLocaleDateString('en-IN', {
                day: '2-digit', month: 'short', year: 'numeric'
              })}
            </div>
            <div className="top-avatar">AF</div>
          </div>
        </header>

        <div className="page-content">
          <section className="welcome-row">
            <div>
              <div className="eyebrow">
                <span className="live-dot"></span> YOUR FARM AT A GLANCE
              </div>
              <h1>{page === 'Overview' ? 'Good morning, Farmer' : page}</h1>
              <p className="subtitle">
                A clearer view of your fields, crops, and daily farm activities.
              </p>
            </div>
            <button
              className="primary-button"
              onClick={() => {
                setPage('Crop management');
                setShowForm(true);
              }}
            >
              <Plus size={17} /> Add new crop
            </button>
          </section>

          {demoMode && (
            <div className="demo-notice">
              <AlertTriangle size={17} />
              <span>
                <b>Preview mode:</b> API connection failed. Check that Spring Boot
                is running on port 8081.
              </span>
            </div>
          )}

          {page === 'Overview' && (
            <>
              <section className="stats-grid">
                <Stat icon={Wheat} label="Active crops" value={crops.length.toString()} change="Across your farm" tone="green" />
                <Stat icon={Sprout} label="Cultivated area" value={`${crops.reduce((s, c) => s + (Number(c.area) || 0), 0).toFixed(1)} ac`} change="Total recorded area" tone="lime" />
                <Stat icon={Droplets} label="Watering logs" value={irrigationLogs.length.toString()} change="Activities recorded" tone="blue" />
                <Stat icon={Activity} label="Crop attention" value={crops.filter(c => c.health === 'Needs attention').length.toString()} change="Review crop health" tone="amber" />
              </section>

              <section className="overview-grid">
                <div className="panel weather-panel">
                  <div className="panel-heading">
                    <div><p className="section-kicker">FIELD CONDITIONS</p><h2>Today's field note</h2></div>
                    <span className="weather-icon"><Sun size={23} /></span>
                  </div>
                  <div className="weather-main">
                    <div><strong>28°</strong><span>Illustrative weather</span></div>
                    <div className="weather-desc">Partly sunny<br /><small>Theni, Tamil Nadu</small></div>
                  </div>
                  <div className="weather-metrics">
                    <div><Droplets size={16} /><span>Humidity</span><b>68%</b></div>
                    <div><Wind size={16} /><span>Wind</span><b>8 km/h</b></div>
                    <div><CloudRain size={16} /><span>Rain chance</span><b>20%</b></div>
                  </div>
                  <p className="small-note">Weather figures are illustrative sample values, not live forecasts.</p>
                </div>

                <div className="panel task-panel">
                  <div className="panel-heading">
                    <div><p className="section-kicker">TODAY'S CHECKLIST</p><h2>Farm priorities</h2></div>
                    <span className="priority-count">03</span>
                  </div>
                  <Task title="Check tomato leaves" desc="Look for spots or pest damage" tag="Crop health" color="amber" />
                  <Task title="Review irrigation schedule" desc="Check soil moisture before watering" tag="Water" color="blue" />
                  <Task title="Update crop growth stage" desc="Keep your crop records current" tag="Records" color="green" />
                </div>
              </section>

              <section className="panel crop-panel">
                <div className="panel-heading">
                  <div><p className="section-kicker">FIELD OVERVIEW</p><h2>Crop records</h2></div>
                  <button className="text-button" onClick={() => setPage('Crop management')}>
                    View all <ArrowUpRight size={15} />
                  </button>
                </div>
                <CropTable
                  crops={crops.slice(0, 4)}
                  onDelete={deleteCrop}
                  onWaterChange={changeWater}
                  compact
                />
              </section>
            </>
          )}

          {page === 'Crop management' && (
            <section className="panel crop-panel">
              <div className="panel-heading">
                <div>
                  <p className="section-kicker">YOUR FIELD DATA</p>
                  <h2>Crop management</h2>
                  <p className="panel-subtitle">Add, search and maintain your crop records.</p>
                </div>
                <button className="primary-button" onClick={() => setShowForm(v => !v)}>
                  <Plus size={16} /> {showForm ? 'Close form' : 'Add crop'}
                </button>
              </div>

              {showForm && (
                <form className="crop-form" onSubmit={addCrop}>
                  <label>Crop name
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="e.g. Tomato" required />
                  </label>
                  <label>Variety
                    <input value={form.variety} onChange={e => setForm({ ...form, variety: e.target.value })} placeholder="e.g. Arka Rakshak" required />
                  </label>
                  <label>Area (acres)
                    <input type="number" min="0.1" step="0.1" value={form.area} onChange={e => setForm({ ...form, area: e.target.value })} placeholder="1.0" required />
                  </label>
                  <label>Growth stage
                    <select value={form.stage} onChange={e => setForm({ ...form, stage: e.target.value })}>
                      <option>Seedling</option><option>Vegetative</option><option>Flowering</option><option>Fruiting</option><option>Harvesting</option>
                    </select>
                  </label>
                  <button className="primary-button" type="submit">Save crop</button>
                </form>
              )}

              <div className="table-tools">
                <div className="searchbox">
                  <Search size={17} />
                  <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search crop or variety..." />
                </div>
                <select value={filter} onChange={e => setFilter(e.target.value)}>
                  <option>All crops</option><option>Healthy</option><option>Needs attention</option>
                </select>
              </div>

              <CropTable
                crops={filteredCrops}
                onDelete={deleteCrop}
                onWaterChange={changeWater}
              />
              {filteredCrops.length === 0 && <div className="empty-state">No crops match your search.</div>}
            </section>
          )}

          {page === 'Irrigation log' && (
            <section className="irrigation-layout">
              <div className="panel">
                <div className="panel-heading">
                  <div><p className="section-kicker">WATER MANAGEMENT</p><h2>Log irrigation</h2><p className="panel-subtitle">Record when and how a field was watered.</p></div>
                  <span className="weather-icon blue-icon"><Droplets size={22} /></span>
                </div>
                <form className="stack-form" onSubmit={logWater}>
                  <label>Field
                    <select value={irrigation.field} onChange={e => setIrrigation({ ...irrigation, field: e.target.value })}>
                      {crops.map(c => <option key={c.id}>{c.name} field</option>)}
                    </select>
                  </label>
                  <label>Duration (minutes)
                    <input type="number" min="1" max="600" value={irrigation.duration} onChange={e => setIrrigation({ ...irrigation, duration: e.target.value })} required />
                  </label>
                  <label>Irrigation method
                    <select value={irrigation.method} onChange={e => setIrrigation({ ...irrigation, method: e.target.value })}>
                      <option>Drip irrigation</option><option>Sprinkler irrigation</option><option>Flood irrigation</option><option>Manual watering</option>
                    </select>
                  </label>
                  <button className="primary-button" type="submit"><Plus size={16} /> Add irrigation record</button>
                </form>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <div><p className="section-kicker">RECENT ACTIVITY</p><h2>Irrigation history</h2></div>
                  <span className="priority-count">{irrigationLogs.length.toString().padStart(2, '0')}</span>
                </div>
                <div className="log-list">
                  {irrigationLogs.map(log => (
                    <div className="log-item" key={log.id}>
                      <div className="log-icon"><Droplets size={18} /></div>
                      <div className="log-info">
                        <b>{log.field}</b>
                        <span>{log.method} · {log.duration} minutes</span>
                        <small>{log.date}</small>
                      </div>
                      <CheckCircle2 size={18} className="log-check" />
                    </div>
                  ))}
                </div>
                <p className="small-note">Irrigation history is currently temporary and will reset on refresh.</p>
              </div>
            </section>
          )}

          {page === 'Sensor monitor' && (
            <section className="sensor-layout">
              <div className="sensor-banner">
                <div>
                  <span className="sensor-label"><Activity size={15} /> SENSOR DEMONSTRATION</span>
                  <h2>Monitor field conditions</h2>
                  <p>This panel uses sample values to demonstrate how sensor readings could be displayed. No physical sensors are connected.</p>
                </div>
                <div className="sensor-art"><Sprout size={76} /></div>
              </div>
              <div className="sensor-cards">
                <Sensor icon={Droplets} label="Soil moisture" value="42%" status="Sample value" color="blue" />
                <Sensor icon={Sun} label="Temperature" value="28°C" status="Sample value" color="amber" />
                <Sensor icon={Activity} label="Air quality" value="Good" status="Sample value" color="green" />
              </div>
              <div className="panel sensor-explain">
                <h2>How this can be extended</h2>
                <p>Connect an Arduino or ESP32 with soil-moisture and temperature sensors, send readings to a Spring Boot REST endpoint, and store timestamped values in MySQL. Until hardware is connected, treat the displayed readings as mock data only.</p>
              </div>
            </section>
          )}

          <footer className="footer">
            <span>© 2026 AgriSmart</span>
            <span>Designed for practical farm record keeping</span>
          </footer>
        </div>
      </main>

      {toast && <div className="toast"><CheckCircle2 size={17} />{toast}</div>}
    </div>
  );
}

function Stat({ icon: Icon, label, value, change, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}><Icon size={19} /></div>
      <p>{label}</p><strong>{value}</strong><span>{change}</span>
    </div>
  );
}

function Task({ title, desc, tag, color }) {
  return (
    <div className="task-row">
      <div className={`task-check ${color}`}><CheckCircle2 size={18} /></div>
      <div className="task-copy"><b>{title}</b><span>{desc}</span></div>
      <span className={`task-tag ${color}`}>{tag}</span>
    </div>
  );
}

function Sensor({ icon: Icon, label, value, status, color }) {
  return (
    <div className="panel sensor-card">
      <div className={`stat-icon ${color}`}><Icon size={20} /></div>
      <p>{label}</p><strong>{value}</strong><span>{status}</span>
    </div>
  );
}

function CropTable({ crops, onDelete, onWaterChange, compact = false }) {
  return (
    <div className="table-scroll">
      <table className="crop-table">
        <thead>
          <tr>
            <th>Crop / Variety</th>
            <th>Area</th>
            <th>Growth stage</th>
            <th>Last watered</th>
            <th>Health status</th>
            {!compact && <th></th>}
          </tr>
        </thead>
        <tbody>
          {crops.map(c => (
            <tr key={c.id}>
              <td>
                <div className="crop-name">
                  <div className="crop-avatar"><Sprout size={17} /></div>
                  <div><b>{c.name}</b><span>{c.variety}</span></div>
                </div>
              </td>
              <td>{Number(c.area).toFixed(1)} ac</td>
              <td><span className="stage-pill">{c.stage}</span></td>
              <td>
                <select
                  value={c.water || 'Not logged'}
                  onChange={e => onWaterChange(c, e.target.value)}
                  aria-label={`Water status for ${c.name}`}
                >
                  <option value="Not logged">Not logged</option>
                  <option value="Today">Today</option>
                  <option value="Yesterday">Yesterday</option>
                  <option value="2 days ago">2 days ago</option>
                </select>
              </td>
              <td>
                <span className={`health-pill ${c.health === 'Healthy' ? 'healthy' : 'attention'}`}>
                  <span></span>{c.health}
                </span>
              </td>
              {!compact && (
                <td>
                  <button className="icon-button" title="Remove crop" onClick={() => onDelete(c.id)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
