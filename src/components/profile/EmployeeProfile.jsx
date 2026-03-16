import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiClient, BASE_URL } from "../../api/apiClient";
import "./EmployeeProfile.css";
import SkillGraph from "../SkillGraph";

// Fonctions utilitaires de persistence
const getStoredLanguages = () => {
	const saved = localStorage.getItem('employeeLanguages');
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Error parsing languages:', e);
		}
	}
	return [
		{ id: 1, name: 'Français', level: 'Native', proficiency: 100 },
		{ id: 2, name: 'Anglais', level: 'Fluent', proficiency: 90 }
	];
};

const getStoredChecklist = () => {
	const saved = localStorage.getItem('employeeChecklist');
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Error parsing checklist:', e);
		}
	}
	return [
		{ id: 1, title: 'Profil Personnel', completed: false },
		{ id: 2, title: 'Position', completed: false },
		{ id: 3, title: 'Compétences', completed: false },
		{ id: 4, title: 'CV Uploadé', completed: false },
		{ id: 5, title: 'IA Scan', completed: false }
	];
};

const getStoredSkills = () => {
	const saved = localStorage.getItem('employeeSkills');
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Error parsing skills:', e);
		}
	}
	return [];
};

const getStoredAiSkills = () => {
	const saved = localStorage.getItem('employeeAiSkills');
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Error parsing AI skills:', e);
		}
	}
	return [];
};

export default function EmployeeProfile() {
	const [profile, setProfile] = useState(null);
	const [dragActive, setDragActive] = useState(false);
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showSkillModal, setShowSkillModal] = useState(false);
	const [skills, setSkills] = useState(getStoredSkills);
	const [editingSkill, setEditingSkill] = useState(null);
	const [editForm, setEditForm] = useState({name: '', level: 'Basic', experience: 0});
	const [newSkill, setNewSkill] = useState({name: '', level: 'Basic', experience: 0});
	const fileInputRef = useRef(null);

	const [aiSkills, setAiSkills] = useState(getStoredAiSkills);
	const [editingAiSkill, setEditingAiSkill] = useState(null);
	const [editAiForm, setEditAiForm] = useState({name: '', category: '', domain: '', market_demand: 0, experience: 0});

	// Languages state - initialised from localStorage
	const [languages, setLanguages] = useState(getStoredLanguages);
	const [showLanguageModal, setShowLanguageModal] = useState(false);
	const [editingLanguage, setEditingLanguage] = useState(null);
	const [languageForm, setLanguageForm] = useState({name: '', level: 'Basic', proficiency: 0});

	// Checklist state - initialised from localStorage
	const [checklistItems, setChecklistItems] = useState(getStoredChecklist);
	const [showChecklistModal, setShowChecklistModal] = useState(false);
	const [editingChecklistItem, setEditingChecklistItem] = useState(null);
	const [checklistForm, setChecklistForm] = useState({title: '', completed: false});

	// Save languages to localStorage whenever they change
	useEffect(() => {
		if (languages.length > 0) {
			localStorage.setItem('employeeLanguages', JSON.stringify(languages));
		}
	}, [languages]);

	// Save checklist to localStorage whenever it changes
	useEffect(() => {
		if (checklistItems.length > 0) {
			localStorage.setItem('employeeChecklist', JSON.stringify(checklistItems));
		}
	}, [checklistItems]);

	// Save skills to localStorage whenever they change
	useEffect(() => {
		if (skills.length > 0) {
			localStorage.setItem('employeeSkills', JSON.stringify(skills));
		}
	}, [skills]);

	// Save AI skills to localStorage whenever they change
	useEffect(() => {
		if (aiSkills.length > 0) {
			localStorage.setItem('employeeAiSkills', JSON.stringify(aiSkills));
		}
	}, [aiSkills]);

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) return;

		apiClient("/auth/me")
			.then((p) => setProfile(p))
			.catch(() => setProfile(null));
	}, []);

	useEffect(() => {
		if (!profile?.id) return;

		apiClient(`/documents/cv-skills/${profile.id}`)
			.then(data => {
				const parsed = typeof data === "string" ? JSON.parse(data) : data;
				const backendSkills = parsed.skills || [];
				const storedSkills = getStoredAiSkills();
				
				// Si nous avons des données localStorage, les fusionner avec le backend
				if (storedSkills.length > 0) {
					// Garder les modifications locales et ajouter les nouvelles du backend
					const existingIds = new Set(storedSkills.map(s => s.name));
					const newSkills = backendSkills.filter(s => !existingIds.has(s.name));
					setAiSkills([...storedSkills, ...newSkills]);
				} else {
					// Si pas de données locales, utiliser celles du backend
					setAiSkills(backendSkills);
				}
			})
			.catch(err => console.error("Erreur skills IA:", err));
	}, [profile]);

	function handleFiles(files) {
		if (!files || files.length === 0) return;
		const f = files[0];
		setFile(f);
	}

	function onDrag(e) {
		e.preventDefault();
		e.stopPropagation();
		if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
		if (e.type === "dragleave") setDragActive(false);
	}

	function onDrop(e) {
		e.preventDefault();
		e.stopPropagation();
		setDragActive(false);
		const dtFiles = e.dataTransfer?.files;
		handleFiles(dtFiles);
	}

	async function uploadCv() {
		if (!file || !profile?.id) return;
		setUploading(true);
		setProgress(0);
		try {
			const url = `/profile/upload-cv/${profile.id}`;

			const form = new FormData();
			form.append("file", file);

			const response = await new Promise((resolve, reject) => {
				const xhr = new XMLHttpRequest();
				xhr.open("POST", `${BASE_URL}${url}`);
				const token = localStorage.getItem("authToken");
				if (token) xhr.setRequestHeader("Authorization", `Bearer ${token}`);

				xhr.upload.onprogress = (e) => {
					if (e.lengthComputable) {
						const pct = Math.round((e.loaded / e.total) * 100);
						setProgress(pct);
					}
				};
				xhr.onload = () => {
					if (xhr.status >= 200 && xhr.status < 300) {
						try {
							resolve(JSON.parse(xhr.responseText));
						} catch {
							resolve({ message: "CV uploadé avec succès" });
						}
					} else {
						try {
							const error = JSON.parse(xhr.responseText);
							reject(new Error(error.error || "Upload échoué"));
						} catch {
							reject(new Error(xhr.responseText || "Upload échoué"));
						}
					}
				};
				xhr.onerror = () => reject(new Error("Erreur réseau"));
				xhr.send(form);
			});

			const fresh = await apiClient(`/profile/${profile.id}`);
			setProfile(fresh);
			setFile(null);

			try {
				const skillsData = await apiClient(`/documents/cv-skills/${profile.id}`);
				const parsed = JSON.parse(skillsData);
				setAiSkills(parsed.skills || []);
			} catch (e) {
				console.error("Erreur récupération skills IA:", e);
			}
			alert("✅ CV uploadé avec succès!");
		} catch (err) {
			console.error("Upload error:", err);
			alert("❌ " + (err.message || "Échec de l'upload. Réessayez."));
		} finally {
			setUploading(false);
			setProgress(0);
		}
	}

	function handleSkillInputChange(e) {
		const { name, value } = e.target;
		setNewSkill(prev => ({
			...prev,
			[name]: name === 'experience' ? parseInt(value) || 0 : value
		}));
	}

	function addSkill() {
		if (!newSkill.name.trim()) return;
		const skill = {
			id: Math.max(...skills.map(s => s.id), 0) + 1,
			name: newSkill.name,
			level: newSkill.level,
			experience: parseInt(newSkill.experience) || 0
		};
		setSkills([...skills, skill]);
		setNewSkill({name: '', level: 'Basic', experience: 0});
		setShowSkillModal(false);
	}

	function deleteSkill(id) {
		setSkills(skills.filter(s => s.id !== id));
	}

	function startEditing(skill) {
		setEditingSkill(skill.id);
		setEditForm({
			name: skill.name,
			level: skill.level,
			experience: skill.experience
		});
	}

	function cancelEditing() {
		setEditingSkill(null);
		setEditForm({name: '', level: 'Basic', experience: 0});
	}

	function saveSkill(id) {
		if (!editForm.name.trim()) return;
		setSkills(skills.map(s =>
			s.id === id
				? {...s, name: editForm.name, level: editForm.level, experience: parseInt(editForm.experience) || 0}
				: s
		));
		setEditingSkill(null);
		setEditForm({name: '', level: 'Basic', experience: 0});
	}

	function handleEditInputChange(e) {
		const { name, value } = e.target;
		setEditForm(prev => ({
			...prev,
			[name]: name === 'experience' ? parseInt(value) || 0 : value
		}));
	}

	function startEditingAiSkill(skill, index) {
		setEditingAiSkill(index);
		setEditAiForm({
			name: skill.name || '',
			category: skill.category || '',
			domain: skill.domain || '',
			market_demand: skill.market_demand || 0,
			experience: skill.experience || 0
		});
	}

	function cancelEditingAiSkill() {
		setEditingAiSkill(null);
		setEditAiForm({name: '', category: '', domain: '', market_demand: 0, experience: 0});
	}

	function saveAiSkill(index) {
		setAiSkills(aiSkills.map((s, i) =>
			i === index
				? {...s, ...editAiForm}
				: s
		));
		setEditingAiSkill(null);
		setEditAiForm({name: '', category: '', domain: '', market_demand: 0, experience: 0});
	}

	function deleteAiSkill(index) {
		setAiSkills(aiSkills.filter((_, i) => i !== index));
	}

	function handleAiEditInputChange(e) {
		const { name, value } = e.target;
		setEditAiForm(prev => ({
			...prev,
			[name]: name === 'market_demand' || name === 'experience' ? parseFloat(value) || 0 : value
		}));
	}

	// Calculate statistics
	const totalSkills = skills.length;
	const expertSkills = skills.filter(s => s.level === 'Expert').length;
	const avgExperience = skills.length > 0 
		? Math.round(skills.reduce((sum, s) => sum + s.experience, 0) / skills.length)
		: 0;
	const topSkills = skills
		.sort((a, b) => {
			const levelOrder = { 'Expert': 4, 'Professional': 3, 'Intermediate': 2, 'Basic': 1 };
			return levelOrder[b.level] - levelOrder[a.level];
		})
		.slice(0, 3);
	
	const getCategoryStats = () => {
		const categories = {};
		aiSkills.forEach(skill => {
			if (!categories[skill.category]) {
				categories[skill.category] = { count: 0, avgDemand: 0 };
			}
			categories[skill.category].count++;
			categories[skill.category].avgDemand += skill.market_demand;
		});
		Object.keys(categories).forEach(cat => {
			categories[cat].avgDemand = categories[cat].avgDemand / categories[cat].count;
		});
		return categories;
	};

	// Calculate profile completion percentage
	const getProfileCompletion = () => {
		let completion = 0;
		const checks = {
			profile: profile?.prenom && profile?.nom ? 20 : 0,
			position: profile?.position ? 15 : 0,
			skills: skills.length >= 3 ? 25 : skills.length * 8,
			cv: profile?.cvPath ? 20 : 0,
			aiSkills: aiSkills.length >= 5 ? 20 : aiSkills.length * 4
		};
		completion = Object.values(checks).reduce((a, b) => a + b, 0);
		return Math.min(completion, 100);
	};

	// Get skill distribution data
	const getSkillDistribution = () => {
		const dist = {
			'Basic': skills.filter(s => s.level === 'Basic').length,
			'Intermediate': skills.filter(s => s.level === 'Intermediate').length,
			'Professional': skills.filter(s => s.level === 'Professional').length,
			'Expert': skills.filter(s => s.level === 'Expert').length
		};
		return dist;
	};

	// Get top expertise areas
	const getTopExpertise = () => {
		const dist = getSkillDistribution();
		return [
			{ label: 'Expert', value: dist.Expert, color: '#fbbf24' },
			{ label: 'Professional', value: dist.Professional, color: '#06b6d4' },
			{ label: 'Intermediate', value: dist.Intermediate, color: '#4ade80' },
			{ label: 'Basic', value: dist.Basic, color: '#f87171' }
		];
	};

	// Professional badges
	const getBadges = () => {
		const badges = [];
		if (skills.length >= 5) badges.push({ emoji: '🎯', title: 'Multi-Skilled', color: '#3b82f6' });
		if (expertSkills > 0) badges.push({ emoji: '⭐', title: 'Expert Level', color: '#fbbf24' });
		if (profile?.cvPath) badges.push({ emoji: '📄', title: 'CV Uploaded', color: '#059669' });
		if (aiSkills.length > 0) badges.push({ emoji: '🧠', title: 'AI-Verified', color: '#8b5cf6' });
		if (avgExperience > 12) badges.push({ emoji: '🚀', title: 'Experienced', color: '#ec4899' });
		if (skills.length >= 10) badges.push({ emoji: '👑', title: 'Polyvalent', color: '#06b6d4' });
		return badges;
	};

	// Language management functions
	function addLanguage() {
		if (!languageForm.name.trim()) return;
		const newLanguage = {
			id: Math.max(...languages.map(l => l.id), 0) + 1,
			name: languageForm.name,
			level: languageForm.level,
			proficiency: languageForm.proficiency
		};
		setLanguages([...languages, newLanguage]);
		setLanguageForm({name: '', level: 'Basic', proficiency: 0});
		setShowLanguageModal(false);
	}

	function startEditingLanguage(language) {
		setEditingLanguage(language.id);
		setLanguageForm({name: language.name, level: language.level, proficiency: language.proficiency});
		setShowLanguageModal(true);
	}

	function saveLanguage() {
		if (!languageForm.name.trim()) return;
		setLanguages(languages.map(lang =>
			lang.id === editingLanguage
				? {...lang, name: languageForm.name, level: languageForm.level, proficiency: languageForm.proficiency}
				: lang
		));
		setEditingLanguage(null);
		setLanguageForm({name: '', level: 'Basic', proficiency: 0});
		setShowLanguageModal(false);
	}

	function deleteLanguage(id) {
		setLanguages(languages.filter(lang => lang.id !== id));
	}

	function cancelEditingLanguage() {
		setEditingLanguage(null);
		setLanguageForm({name: '', level: 'Basic', proficiency: 0});
		setShowLanguageModal(false);
	}

	function handleLanguageInputChange(e) {
		const { name, value } = e.target;
		setLanguageForm(prev => ({
			...prev,
			[name]: name === 'proficiency' ? parseInt(value) || 0 : value
		}));
	}

	// Checklist management functions
	function addChecklistItem() {
		if (!checklistForm.title.trim()) return;
		const newItem = {
			id: Math.max(...checklistItems.map(i => i.id), 0) + 1,
			title: checklistForm.title,
			completed: checklistForm.completed
		};
		setChecklistItems([...checklistItems, newItem]);
		setChecklistForm({title: '', completed: false});
		setShowChecklistModal(false);
	}

	function startEditingChecklistItem(item) {
		setEditingChecklistItem(item.id);
		setChecklistForm({title: item.title, completed: item.completed});
		setShowChecklistModal(true);
	}

	function saveChecklistItem() {
		if (!checklistForm.title.trim()) return;
		setChecklistItems(checklistItems.map(item =>
			item.id === editingChecklistItem
				? {...item, title: checklistForm.title, completed: checklistForm.completed}
				: item
		));
		setEditingChecklistItem(null);
		setChecklistForm({title: '', completed: false});
		setShowChecklistModal(false);
	}

	function toggleChecklistItem(id) {
		setChecklistItems(checklistItems.map(item =>
			item.id === id ? {...item, completed: !item.completed} : item
		));
	}

	function deleteChecklistItem(id) {
		setChecklistItems(checklistItems.filter(item => item.id !== id));
	}

	function cancelEditingChecklistItem() {
		setEditingChecklistItem(null);
		setChecklistForm({title: '', completed: false});
		setShowChecklistModal(false);
	}

	function handleChecklistInputChange(e) {
		const { name, value, type, checked } = e.target;
		setChecklistForm(prev => ({
			...prev,
			[name]: type === 'checkbox' ? checked : value
		}));
	}

	return (
		<div className="employee-profile">
			{/* Header Section */}
			<div className="profile-header-section">
				<div className="avatar-circle">
					{profile?.prenom?.[0]}{profile?.nom?.[0]}
				</div>
				<div className="profile-info">
					<h1 className="profile-name">{profile ? `${profile.prenom} ${profile.nom}` : "Profil Employé"}</h1>
					<p className="profile-position">{profile?.position || "Professionnel"}</p>
					<div className="profile-meta">
						<span className="meta-item">📧 {profile?.email}</span>
						<span className="meta-item">📱 {profile?.phone || "Non fourni"}</span>
						<span className="meta-item">🏢 {profile?.company || "Non spécifiée"}</span>
					</div>
				</div>
			</div>

			{/* Statistics Section */}
			{skills.length > 0 && (
				<div className="stats-section">
					<div className="stat-card">
						<div className="stat-icon">📊</div>
						<div className="stat-content">
							<div className="stat-value">{totalSkills}</div>
							<div className="stat-label">Compétences Totales</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">⭐</div>
						<div className="stat-content">
							<div className="stat-value">{expertSkills}</div>
							<div className="stat-label">Expertise</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">⏱️</div>
						<div className="stat-content">
							<div className="stat-value">{avgExperience}</div>
							<div className="stat-label">Mois Moyen</div>
						</div>
					</div>
					<div className="stat-card">
						<div className="stat-icon">🚀</div>
						<div className="stat-content">
							<div className="stat-value">{Math.round((expertSkills/totalSkills)*100)}%</div>
							<div className="stat-label">Maîtrise</div>
						</div>
					</div>
				</div>
			)}

			{/* Professional Badges Section */}
			{getBadges().length > 0 && (
				<div className="badges-section">
					<h2>🏅 Réalisations Professionnelles</h2>
					<div className="badges-container">
						{getBadges().map((badge, idx) => (
							<div key={idx} className="badge-item" style={{borderTopColor: badge.color}}>
								<div className="badge-emoji">{badge.emoji}</div>
								<div className="badge-title">{badge.title}</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Profile Completion Bar */}
			<div className="profile-completion-section">
			<div className="section-header">
				<h2>📈 Complétude du Profil</h2>
				<button className="secondary-button" onClick={() => setShowChecklistModal(true)}>
					+ Ajouter un Élément
				</button>
			</div>
			<div className="completion-container">
				<div className="completion-bar-wrapper">
					<div className="completion-label">
						<span>Profil Complet</span>
						<span className="completion-percentage">{Math.round((checklistItems.filter(i => i.completed).length / checklistItems.length) * 100)}%</span>
					</div>
					<div className="completion-bar">
						<div className="completion-fill" style={{width: `${(checklistItems.filter(i => i.completed).length / checklistItems.length) * 100}%`}}></div>
					</div>
				</div>
				<div className="completion-checklist">
					{checklistItems.map((item) => (
						<div key={item.id} className={`checklist-item ${item.completed ? 'done' : ''}`}>
							<div className="checklist-content">
								<input 
									type="checkbox" 
									checked={item.completed} 
									onChange={() => toggleChecklistItem(item.id)}
									className="checklist-checkbox"
								/>
								<span>{item.title}</span>
							</div>
							<div className="checklist-item-actions">
								<button className="edit-btn" onClick={() => startEditingChecklistItem(item)}>✏️</button>
								<button className="delete-btn" onClick={() => deleteChecklistItem(item.id)}>🗑️</button>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>

		{/* Languages Section */}
			<div className="languages-section">
			<div className="section-header">
				<h2>🌍 Langues Maîtrisées</h2>
				<button className="secondary-button" onClick={() => setShowLanguageModal(true)}>
					+ Ajouter une Langue
				</button>
			</div>
			<div className="languages-container">
				{languages.map((lang) => (
					<div key={lang.id} className="language-card">
						<div className="language-header">
							<div className="language-header-content">
								<span className="language-name">{lang.name}</span>
								<span className="language-level">{lang.level}</span>
							</div>
							<div className="language-actions">
								<button className="edit-btn" onClick={() => startEditingLanguage(lang)}>✏️</button>
								<button className="delete-btn" onClick={() => deleteLanguage(lang.id)}>🗑️</button>
							</div>
								<div className="language-fill" style={{width: `${lang.proficiency}%`}}></div>
							</div>
							<div className="language-percentage">{lang.proficiency}%</div>
						</div>
					))}
				</div>
			</div>

			{/* Skill Distribution Chart */}
			{skills.length > 0 && (
				<div className="skill-distribution-section">
					<h2>📊 Distribution des Compétences</h2>
					<div className="distribution-container">
						{getTopExpertise().map((expertise, idx) => (
							expertise.value > 0 && (
								<div key={idx} className="distribution-item">
									<div className="distribution-label">
										<span>{expertise.label}</span>
										<span className="distribution-value">{expertise.value}</span>
									</div>
									<div className="distribution-bar">
										<div className="distribution-fill" style={{
											width: `${(expertise.value / skills.length) * 100}%`,
											backgroundColor: expertise.color
										}}></div>
									</div>
								</div>
							)
						))}
					</div>
				</div>
			)}

			{/* Main Content Grid */}
			<div className="profile-content-grid">
				{/* Sidebar */}
				<div className="profile-sidebar">
					{/* Top Skills Card */}
					{topSkills.length > 0 && (
						<div className="top-skills-card">
							<h3>🏆 Vos Meilleures Compétences</h3>
							<div className="top-skills-list">
								{topSkills.map((skill, idx) => (
									<div key={skill.id} className="skill-item-with-bar">
										<div className="skill-bar-header">
											<span className="skill-bar-name">{skill.name}</span>
											<span className={`skill-badge level-${skill.level.toLowerCase()}`}>{skill.level}</span>
										</div>
										<div className="skill-progress-bar">
											<div className={`skill-progress-fill level-${skill.level.toLowerCase()}`} style={{
												width: `${(skill.experience / 120) * 100}%`
											}}></div>
										</div>
										<div className="skill-bar-footer">
											<small>{skill.experience} mois</small>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					<div className="skills-overview-card">
						<h3>⭐ Compétences Clés</h3>
						<SkillGraph compact />
					</div>
				</div>

				{/* Main Content */}
				<div className="profile-main">
					{/* CV Upload Section */}
					<div className="cv-upload-section">
						<h2>📄 Gestion du CV</h2>
						<div className={`upload-zone ${dragActive ? 'active' : ''}`} onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}>
							<input
								ref={fileInputRef}
								type="file"
								accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
								style={{ display: 'none' }}
								onChange={(e) => handleFiles(e.target.files)}
							/>
							{!file ? (
								<div className="upload-content">
									<div className="upload-icon">📤</div>
									<h3>Déposez votre CV ici</h3>
									<p>ou <button className="link-button" onClick={() => fileInputRef.current?.click()}>sélectionnez un fichier</button></p>
									<small>PDF, Word • Max 10MB</small>
								</div>
							) : (
								<div className="file-preview">
									<div className="file-icon">📋</div>
									<div className="file-info">
										<p className="file-name">{file.name}</p>
										<small>{(file.size/1024).toFixed(0)} KB</small>
									</div>
									<button className="remove-file" onClick={() => setFile(null)}>✕</button>
								</div>
							)}
						</div>
						{profile?.cvPath && !file && (
							<div className="current-cv">
								CV actuel: <a href={profile.cvPath} target="_blank" rel="noreferrer">Télécharger</a>
							</div>
						)}
						<button className="primary-button upload-cv" onClick={uploadCv} disabled={!file || uploading}>
							{uploading ? `⏳ Upload ${progress}% ...` : '⬆️ Envoyer le CV'}
						</button>
						{uploading && <div className="progress-bar"><div className="progress-fill" style={{ width: `${progress}%` }} /></div>}
					</div>

					{/* Category Stats Section */}
					{aiSkills.length > 0 && Object.keys(getCategoryStats()).length > 0 && (
						<div className="category-stats-section">
							<h2>📈 Domaines d'Expertise</h2>
							<div className="category-cards">
								{Object.entries(getCategoryStats()).map(([category, stats]) => (
									<div key={category} className="category-card">
										<div className="category-header">
											<h4>{category}</h4>
											<span className="category-badge">{stats.count} compétence{stats.count > 1 ? 's' : ''}</span>
										</div>
										<div className="category-bar-container">
											<div className="category-label">Demande Marché</div>
											<div className="category-progress-bar">
												<div className="category-progress-fill" style={{
													width: `${stats.avgDemand * 100}%`
												}}></div>
											</div>
											<div className="category-percentage">{Math.round(stats.avgDemand * 100)}%</div>
										</div>
									</div>
								))}
							</div>
						</div>
					)}

					{/* Manual Skills Management */}
					<div className="skills-management">
						<div className="section-header">
							<h2>💼 Mes Compétences</h2>
							<button className="secondary-button" onClick={() => setShowSkillModal(true)}>
								+ Ajouter une compétence
							</button>
						</div>

						{skills.length === 0 ? (
							<div className="empty-state">
								<p>Aucune compétence ajoutée. Commencez par en ajouter une.</p>
							</div>
						) : (
							<div className="skills-table-container">
								<table className="skills-table">
									<thead>
										<tr>
											<th>Compétence</th>
											<th>Niveau</th>
											<th>Expérience</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{skills.map((skill) => (
											<tr key={skill.id}>
												<td>
													{editingSkill === skill.id ? (
														<input
															type="text"
															value={editForm.name}
															name="name"
															onChange={handleEditInputChange}
															className="table-input"
														/>
													) : (
														<span className="skill-name">{skill.name}</span>
													)}
												</td>
												<td>
													{editingSkill === skill.id ? (
														<select
															value={editForm.level}
															name="level"
															onChange={handleEditInputChange}
															className="table-select"
														>
															<option value="Basic">Basique</option>
															<option value="Intermediate">Intermédiaire</option>
															<option value="Professional">Professionnel</option>
															<option value="Expert">Expert</option>
														</select>
													) : (
														<span className={`skill-level level-${skill.level.toLowerCase()}`}>
															{skill.level}
														</span>
													)}
												</td>
												<td>
													{editingSkill === skill.id ? (
														<input
															type="number"
															value={editForm.experience}
															name="experience"
															onChange={handleEditInputChange}
															min="0"
															max="1200"
															className="table-input number-input"
														/>
													) : (
														<span>{skill.experience} mois</span>
													)}
												</td>
												<td>
													<div className="action-buttons">
														{editingSkill === skill.id ? (
															<>
																<button className="save-btn" onClick={() => saveSkill(skill.id)}>✓</button>
																<button className="cancel-btn" onClick={cancelEditing}>✕</button>
															</>
														) : (
															<>
																<button className="edit-btn" onClick={() => startEditing(skill)}>✏️</button>
																<button className="delete-btn" onClick={() => deleteSkill(skill.id)}>🗑️</button>
															</>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>

					{/* AI Extracted Skills */}
					{aiSkills.length > 0 && (
						<div className="ai-skills-section">
							<h2>🧠 Compétences Extraites par IA</h2>
							<div className="ai-skills-table-container">
								<table className="ai-skills-table">
									<thead>
										<tr>
											<th>Compétence</th>
											<th>Catégorie</th>
											<th>Domaine</th>
											<th>Demande Marché</th>
											<th>Expérience</th>
											<th>Actions</th>
										</tr>
									</thead>
									<tbody>
										{aiSkills.map((s, i) => (
											<tr key={i}>
												<td>
													{editingAiSkill === i ? (
														<input
															type="text"
															value={editAiForm.name}
															name="name"
															onChange={handleAiEditInputChange}
															className="table-input"
														/>
													) : (
														s.name
													)}
												</td>
												<td>
													{editingAiSkill === i ? (
														<input
															type="text"
															value={editAiForm.category}
															name="category"
															onChange={handleAiEditInputChange}
															className="table-input"
														/>
													) : (
														s.category
													)}
												</td>
												<td>
													{editingAiSkill === i ? (
														<input
															type="text"
															value={editAiForm.domain}
															name="domain"
															onChange={handleAiEditInputChange}
															className="table-input"
														/>
													) : (
														s.domain
													)}
												</td>
												<td>
													{editingAiSkill === i ? (
														<input
															type="number"
															value={editAiForm.market_demand}
															name="market_demand"
															onChange={handleAiEditInputChange}
															min="0"
															max="1"
															step="0.01"
															className="table-input number-input"
														/>
													) : (
														`${(s.market_demand * 100).toFixed(0)}%`
													)}
												</td>
												<td>
													{editingAiSkill === i ? (
														<input
															type="number"
															value={editAiForm.experience}
															name="experience"
															onChange={handleAiEditInputChange}
															min="0"
															max="1200"
															className="table-input number-input"
														/>
													) : (
														s.experience ? `${s.experience} mois` : '0 mois'
													)}
												</td>
												<td>
													<div className="action-buttons">
														{editingAiSkill === i ? (
															<>
																<button className="save-btn" onClick={() => saveAiSkill(i)}>✓</button>
																<button className="cancel-btn" onClick={cancelEditingAiSkill}>✕</button>
															</>
														) : (
															<>
																<button className="edit-btn" onClick={() => startEditingAiSkill(s, i)}>✏️</button>
																<button className="delete-btn" onClick={() => deleteAiSkill(i)}>🗑️</button>
															</>
														)}
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						</div>
					)}
				</div>
			</div>

			{/* Add Skill Modal */}
			{showSkillModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<h2>Ajouter une Compétence</h2>
							<button className="modal-close" onClick={() => setShowSkillModal(false)}>✕</button>
						</div>
						<form className="modal-form" onSubmit={(e) => {e.preventDefault(); addSkill();}}>
							<div className="form-group">
								<label>Nom de la compétence</label>
								<input
									type="text"
									name="name"
									value={newSkill.name}
									onChange={handleSkillInputChange}
									placeholder="Ex: Python, JavaScript, React"
								/>
							</div>
							<div className="form-group">
								<label>Niveau</label>
								<select
									name="level"
									value={newSkill.level}
									onChange={handleSkillInputChange}
								>
									<option value="Basic">Basique</option>
									<option value="Intermediate">Intermédiaire</option>
									<option value="Professional">Professionnel</option>
									<option value="Expert">Expert</option>
								</select>
							</div>
							<div className="form-group">
								<label>Expérience (mois)</label>
								<input
									type="number"
									name="experience"
									value={newSkill.experience}
									onChange={handleSkillInputChange}
									min="0"
									max="1200"
									placeholder="Ex: 24"
								/>
							</div>
							<div className="modal-actions">
								<button type="button" className="cancel-button" onClick={() => setShowSkillModal(false)}>
									Annuler
								</button>
								<button type="submit" className="primary-button">
									Ajouter la compétence
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Add/Edit Language Modal */}
			{showLanguageModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<h2>{editingLanguage ? 'Modifier Langue' : 'Ajouter une Langue'}</h2>
							<button className="modal-close" onClick={cancelEditingLanguage}>✕</button>
						</div>
						<form className="modal-form" onSubmit={(e) => {e.preventDefault(); editingLanguage ? saveLanguage() : addLanguage();}}>
							<div className="form-group">
								<label>Nom de la Langue</label>
								<input
									type="text"
									name="name"
									value={languageForm.name}
									onChange={handleLanguageInputChange}
									placeholder="Ex: Français, Anglais, Espagnol"
									required
								/>
							</div>
							<div className="form-group">
								<label>Niveau</label>
								<select
									name="level"
									value={languageForm.level}
									onChange={handleLanguageInputChange}
								>
									<option value="Basic">Basique</option>
									<option value="Intermediate">Intermédiaire</option>
									<option value="Advanced">Avancé</option>
									<option value="Fluent">Courant</option>
									<option value="Native">Natif</option>
								</select>
							</div>
							<div className="form-group">
								<label>Maîtrise (%)</label>
								<input
									type="number"
									name="proficiency"
									value={languageForm.proficiency}
									onChange={handleLanguageInputChange}
									min="0"
									max="100"
									step="5"
									placeholder="Ex: 90"
									required
								/>
							</div>
							<div className="modal-actions">
								<button type="button" className="cancel-button" onClick={cancelEditingLanguage}>
									Annuler
								</button>
								<button type="submit" className="primary-button">
									{editingLanguage ? 'Modifier la Langue' : 'Ajouter la Langue'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}

			{/* Add/Edit Checklist Modal */}
			{showChecklistModal && (
				<div className="modal-overlay">
					<div className="modal-content">
						<div className="modal-header">
							<h2>{checklistForm.id ? 'Modifier l\'Élément' : 'Ajouter un Élément'}</h2>
							<button className="modal-close" onClick={cancelEditingChecklistItem}>✕</button>
						</div>
						<form className="modal-form" onSubmit={(e) => {e.preventDefault(); checklistForm.id ? saveChecklistItem() : addChecklistItem();}}>
							<div className="form-group">
								<label>Titre de l'Élément</label>
								<input
									type="text"
									name="title"
									value={checklistForm.title}
									onChange={handleChecklistInputChange}
									placeholder="Ex: Ajouter une photo de profil"
									required
								/>
							</div>
							<div className="form-group">
								<label className="checkbox-label">
									<input
										type="checkbox"
										name="completed"
										checked={checklistForm.completed}
										onChange={handleChecklistInputChange}
										className="form-checkbox"
									/>
									Marquer comme complété
								</label>
							</div>
							<div className="modal-actions">
								<button type="button" className="cancel-button" onClick={cancelEditingChecklistItem}>
									Annuler
								</button>
								<button type="submit" className="primary-button">
									{checklistForm.id ? 'Modifier l\'Élément' : 'Ajouter l\'Élément'}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

