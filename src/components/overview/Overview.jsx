
import React, { useEffect, useRef, useState } from "react";
import { apiClient } from "../../api/apiClient";
import { useAuth } from "../../context/AuthContext";
import "./Overview.css";

const AVAILABLE_ROLES = [
	'Junior Developer', 'Developer', 'Senior Developer', 'Tech Lead', 'Architect',
	'Junior QA Engineer', 'QA Engineer', 'Senior QA Engineer', 'QA Lead', 'QA Manager',
	'Junior DevOps Engineer', 'DevOps Engineer', 'Senior DevOps Engineer', 'DevOps Lead', 'DevOps Architect',
	'Data Analyst', 'Senior Data Analyst', 'Data Scientist', 'Data Architect', 'Chief Data Officer',
	'Junior Data Engineer', 'Data Engineer', 'Senior Data Engineer', 'Data Engineering Lead', 'Data Platform Architect',
	'ML Engineer', 'Senior ML Engineer', 'ML Architect', 'AI Research Lead', 'Chief AI Officer',
	'Business Analyst', 'Senior Business Analyst', 'BI Analyst', 'BI Manager', 'BI Director',
	'Junior Designer', 'Designer', 'Senior Designer', 'Design Lead', 'Creative Director',
	'Junior Consultant', 'Consultant', 'Senior Consultant', 'Manager', 'Director',
	'Financial Analyst', 'Senior Financial Analyst', 'Finance Manager', 'Finance Director', 'CFO',
	'Security Analyst', 'Senior Security Engineer', 'Security Architect', 'Security Manager', 'CISO',
];

export default function Overview() {
	const { user } = useAuth();
	const [profile, setProfile] = useState(null);
	const [editMode, setEditMode] = useState(false);
	const [form, setForm] = useState({
		nom: "",
		prenom: "",
		email: "",
		phone: "",
		currentRole: "",
		company: ""
	});
	const [photoPreview, setPhotoPreview] = useState(null);
	const [topSkills, setTopSkills] = useState([]);
	const [skillInput, setSkillInput] = useState({ name: '', level: 'Junior' });
	const [editingSkillId, setEditingSkillId] = useState(null);
	const [editingSkill, setEditingSkill] = useState({ name: '', level: 'Junior' });
	const [skillsLoadedKey, setSkillsLoadedKey] = useState(null);
	const photoInputRef = useRef(null);

	const profileStorageKey = user ? `overviewProfile_${user.id || user.email || 'guest'}` : 'overviewProfile_guest';
	const photoStorageKey = user ? `overviewProfilePhoto_${user.id || user.email || 'guest'}` : 'overviewProfilePhoto_guest';
	const skillsStorageKey = user ? `overviewSkills_${user.id || user.email || 'guest'}` : 'overviewSkills_guest';

	useEffect(() => {
		if (user) {
			setProfile(user);
			setForm({
				nom: user?.nom || '',
				prenom: user?.prenom || '',
				email: user?.email || '',
				phone: user?.phone || '',
				currentRole: user?.currentRole || '',
				company: user?.company || ''
			});
			return;
		}

		const saved = localStorage.getItem(profileStorageKey);
		if (saved) {
			const parsed = JSON.parse(saved);
			setProfile(parsed);
			setForm({
				nom: parsed.nom || '',
				prenom: parsed.prenom || '',
				email: parsed.email || '',
				phone: parsed.phone || '',
				currentRole: parsed.currentRole || '',
				company: parsed.company || ''
			});
		}
	}, [user, profileStorageKey]);

	useEffect(() => {
		if (profile) {
			localStorage.setItem(profileStorageKey, JSON.stringify(profile));
		}
	}, [profile, profileStorageKey]);

	useEffect(() => {
		const savedPhoto = localStorage.getItem(photoStorageKey);
		if (savedPhoto) {
			setPhotoPreview(savedPhoto);
		}
	}, [photoStorageKey]);

	useEffect(() => {
		if (photoPreview) {
			localStorage.setItem(photoStorageKey, photoPreview);
		}
	}, [photoPreview, photoStorageKey]);

	useEffect(() => {
		let parsed = [];
		const saved = localStorage.getItem(skillsStorageKey);
		if (saved) {
			try {
				const p = JSON.parse(saved);
				parsed = Array.isArray(p) ? p : [];
			} catch (err) {
				console.error('Error reading skills', err);
			}
		}
		// Both state updates are batched into one render by React 18
		setTopSkills(parsed);
		setSkillsLoadedKey(skillsStorageKey);
	}, [skillsStorageKey]);

	useEffect(() => {
		// Only write when the loaded key matches the current key (prevents stale-data overwrite)
		if (skillsLoadedKey !== skillsStorageKey) return;
		localStorage.setItem(skillsStorageKey, JSON.stringify(topSkills));
	}, [topSkills, skillsStorageKey, skillsLoadedKey]);

	const handleSkillInputChange = (e) => {
		const { name, value } = e.target;
		setSkillInput((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const addTopSkill = () => {
		if (!skillInput.name.trim()) return;
		setTopSkills((prev) => [
			...prev,
			{
				id: Date.now(),
				name: skillInput.name.trim(),
				level: skillInput.level
			}
		]);
		setSkillInput({ name: '', level: 'Junior' });
	};

	const startEditSkill = (skill) => {
		setEditingSkillId(skill.id);
		setEditingSkill({ name: skill.name, level: skill.level });
	};

	const cancelEditSkill = () => {
		setEditingSkillId(null);
		setEditingSkill({ name: '', level: 'Junior' });
	};

	const saveEditSkill = (id) => {
		if (!editingSkill.name.trim()) return;
		setTopSkills((prev) =>
			prev.map((s) => s.id === id ? { ...s, name: editingSkill.name.trim(), level: editingSkill.level } : s)
		);
		setEditingSkillId(null);
	};

	const deleteTopSkill = (id) => {
		setTopSkills((prev) => prev.filter((skill) => skill.id !== id));
	};

	const handlePhotoChange = (e) => {
		const file = e.target.files?.[0];
		if (!file) return;
		if (file.size > 5 * 1024 * 1024) {
			alert('The photo must be less than 5MB');
			return;
		}
		const reader = new FileReader();
		reader.onloadend = () => {
			setPhotoPreview(reader.result);
		};
		reader.readAsDataURL(file);
	};

	const selectPhoto = () => {
		photoInputRef.current?.click();
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setForm((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const startEdit = () => {
		setEditMode(true);
	};

	const cancelEdit = () => {
		setEditMode(false);
		setForm({
			nom: profile?.nom || '',
			prenom: profile?.prenom || '',
			email: profile?.email || '',
			phone: profile?.phone || '',
			currentRole: profile?.currentRole || '',
			company: profile?.company || ''
		});
	};

	const saveProfile = async () => {
		const updated = {
			...(profile || {}),
			nom: form.nom,
			prenom: form.prenom,
			email: form.email,
			phone: form.phone,
			currentRole: form.currentRole,
			company: form.company
		};
		setProfile(updated);
		setForm(updated);
		localStorage.setItem(profileStorageKey, JSON.stringify(updated));
		setEditMode(false);
		// Sauvegarde côté backend si connecté
		try {
			await apiClient('/profile', {
				method: 'PUT',
				body: JSON.stringify({
					prenom: form.prenom,
					nom: form.nom,
					email: form.email,
					currentRole: form.currentRole,
					phone: form.phone,
					company: form.company,
					password: form.password || undefined
				})
			});
		} catch (err) {
			alert('Erreur lors de la sauvegarde du profil');
		}
	};

	const levelColors = {
		Expert:       { bg: '#dcfce7', text: '#166534', border: '#22c55e' },
		Senior:       { bg: '#dbeafe', text: '#1e40af', border: '#3b82f6' },
		Intermediate: { bg: '#fef3c7', text: '#92400e', border: '#f59e0b' },
		Junior:       { bg: '#f1f5f9', text: '#475569', border: '#94a3b8' }
	};

	const levelPercent = { Expert: 100, Senior: 75, Intermediate: 50, Junior: 25 };

	return (
		<div className="ov-container">
			{/* Hero Banner */}
			<div className="ov-banner">
				<div className="ov-banner-pattern" />
			</div>

			{/* Profile Card */}
			<div className="ov-card ov-profile-card">
				<div className="ov-avatar-wrap">
					<div
						className={`ov-avatar${photoPreview ? ' has-photo' : ''}`}
						style={photoPreview ? { backgroundImage: `url(${photoPreview})` } : undefined}
					>
						{!photoPreview && (
							<span className="ov-avatar-initials">
								{(form.prenom?.[0] || 'C') + (form.nom?.[0] || 'H')}
							</span>
						)}
						<button type="button" className="ov-avatar-btn" onClick={selectPhoto}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
								<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
								<circle cx="12" cy="13" r="4" />
							</svg>
						</button>
						<input
							type="file"
							ref={photoInputRef}
							accept="image/jpeg,image/png,image/webp"
							style={{ display: 'none' }}
							onChange={handlePhotoChange}
						/>
					</div>
				</div>

				<div className="ov-profile-body">
					<h1 className="ov-name">{form.prenom || 'Your'} {form.nom || 'Name'}</h1>
					<span className="ov-role-chip">
						<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"/><path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16"/></svg>
						{form.currentRole || 'Professional'}
					</span>
					{form.email && (
						<span className="ov-contact-chip">
							<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
							{form.email}
						</span>
					)}
				</div>

				<div className="ov-edit-floating">
					{!editMode ? (
						<button className="ov-btn-edit" type="button" onClick={startEdit}>
							<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
							Edit
						</button>
					) : (
						<div className="ov-edit-group">
							<button className="ov-btn-cancel" type="button" onClick={cancelEdit}>Cancel</button>
							<button className="ov-btn-save" type="button" onClick={saveProfile}>
								<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
								Save
							</button>
						</div>
					)}
				</div>
			</div>

			{/* Details card */}
			<div className="ov-card ov-details-card">
				<h2 className="ov-section-title">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
					Personal Information
				</h2>
				<div className="ov-fields-grid">
					{[
						{ label: 'Last Name', name: 'nom', type: 'text', icon: '👤' },
						{ label: 'First Name', name: 'prenom', type: 'text', icon: '🧑' },
						{ label: 'Email', name: 'email', type: 'email', icon: '✉️' },
						{ label: 'Phone', name: 'phone', type: 'tel', icon: '📱' },
						{ label: 'Current Role', name: 'currentRole', type: 'select', icon: '💼' },
					].map((field) => (
						<div className="ov-field" key={field.name}>
							<label className="ov-field-label">
								<span className="ov-field-icon">{field.icon}</span>
								{field.label}
							</label>
							{editMode && field.name === 'currentRole' ? (
								<select
									name="currentRole"
									value={form.currentRole}
									onChange={handleInputChange}
									className="ov-field-input"
								>
									<option value="">Select current role</option>
									{AVAILABLE_ROLES.map((role) => (
										<option key={role} value={role}>{role}</option>
									))}
								</select>
							) : editMode ? (
								<input
									name={field.name}
									type={field.type}
									value={form[field.name]}
									onChange={handleInputChange}
									className="ov-field-input"
									placeholder={`Enter ${field.label.toLowerCase()}`}
								/>
							) : (
								<span className="ov-field-value">{form[field.name] || 'Not specified'}</span>
							)}
						</div>
					))}
				</div>
			</div>

			{/* Skills card */}
			<div className="ov-card ov-skills-card">
				<h2 className="ov-section-title">
					<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
					Top Skills
				</h2>

				<div className="ov-skill-form">
					<div className="ov-skill-form-row">
						<input
							name="name"
							type="text"
							value={skillInput.name}
							onChange={handleSkillInputChange}
							className="ov-field-input"
							placeholder="e.g. React, Python, UX Design..."
						/>
						<select
							name="level"
							value={skillInput.level}
							onChange={handleSkillInputChange}
							className="ov-field-input ov-select"
						>
							<option>Junior</option>
							<option>Intermediate</option>
							<option>Senior</option>
							<option>Expert</option>
						</select>
						<button className="ov-btn-add" type="button" onClick={addTopSkill}>
							<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
							Add
						</button>
					</div>
				</div>

				{topSkills.length > 0 ? (
					<div className="ov-skills-list">
						{topSkills.map((skill, index) => {
							const colors = levelColors[skill.level] || levelColors.Junior;
							const pct = levelPercent[skill.level] || 25;
							const isEditing = editingSkillId === skill.id;
							return (
								<div className="ov-skill-item" key={skill.id}>
									<div className="ov-skill-rank">#{index + 1}</div>
									<div className="ov-skill-info">
										{isEditing ? (
											<div className="ov-skill-edit-row">
												<input
													type="text"
													value={editingSkill.name}
													onChange={(e) => setEditingSkill((p) => ({ ...p, name: e.target.value }))}
													className="ov-field-input"
													autoFocus
												/>
												<select
													value={editingSkill.level}
													onChange={(e) => setEditingSkill((p) => ({ ...p, level: e.target.value }))}
													className="ov-field-input ov-select"
												>
													<option>Junior</option>
													<option>Intermediate</option>
													<option>Senior</option>
													<option>Expert</option>
												</select>
												<button className="ov-btn-save" type="button" onClick={() => saveEditSkill(skill.id)} title="Save">
													<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
												</button>
												<button className="ov-btn-cancel" type="button" onClick={cancelEditSkill} title="Cancel">
													<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
												</button>
											</div>
										) : (
											<>
												<div className="ov-skill-top">
													<span className="ov-skill-name">{skill.name}</span>
													<span className="ov-skill-level" style={{ background: colors.bg, color: colors.text, borderColor: colors.border }}>
														{skill.level}
													</span>
												</div>
												<div className="ov-skill-bar-track">
													<div className="ov-skill-bar-fill" style={{ width: `${pct}%`, background: colors.border }} />
												</div>
											</>
										)}
									</div>
									{!isEditing && (
										<>
											<button className="ov-skill-edit-btn" type="button" onClick={() => startEditSkill(skill)} title="Edit skill">
												<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
											</button>
											<button className="ov-skill-delete" type="button" onClick={() => deleteTopSkill(skill.id)} title="Remove skill">
												<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
											</button>
										</>
									)}
								</div>
							);
						})}
					</div>
				) : (
					<div className="ov-empty">
						<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
						<p>No skills added yet</p>
						<span>Showcase your expertise by adding your top skills above.</span>
					</div>
				)}
			</div>
		</div>
	);
}
