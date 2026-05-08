import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiClient, BASE_URL } from "../../api/apiClient";
import { getEmployeeNotifications } from "../../api/projectApi";
import EmployeeRecommendations from "./EmployeeRecommendations";
import "./EmployeeProfile.css";
import SkillGraph from "../SkillGraph";
import CareerRecommendationForm from "./CareerRecommendationForm";
import CareerPage from "../career/career";
import ResumePage from "../resume/Resume";
import Overview from "../overview/Overview";
import Sidebar from "./EmployeSidebar";
import SkillSection from "../skill/skill";
import Dashboardemploye from "../dashboardemploye/Dashboardemploye";

// Fonctions utilitaires de persistence (scoped par userId)
const getStoredLanguages = (userId) => {
	if (!userId) return [];
	const saved = localStorage.getItem(`employeeLanguages_${userId}`);
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

const getStoredChecklist = (userId) => {
	if (!userId) return [];
	const saved = localStorage.getItem(`employeeChecklist_${userId}`);
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

const getStoredSkills = (userId) => {
	if (!userId) return [];
	const saved = localStorage.getItem(`employeeSkills_${userId}`);
	if (saved) {
		try {
			return JSON.parse(saved);
		} catch (e) {
			console.error('Error parsing skills:', e);
		}
	}
	return [];
};

const getStoredAiSkills = (userId) => {
	if (!userId) return [];
	const saved = localStorage.getItem(`employeeAiSkills_${userId}`);
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
	const [activeSection, setActiveSection] = useState('overview');
	const [dragActive, setDragActive] = useState(false);
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showSkillModal, setShowSkillModal] = useState(false);
	const [skills, setSkills] = useState([]);
	const [editingSkill, setEditingSkill] = useState(null);
	const [editForm, setEditForm] = useState({name: '', level: 'Basic', experience: 0});
	const [newSkill, setNewSkill] = useState({name: '', level: 'Basic', experience: 0});
	const fileInputRef = useRef(null);

	const [aiSkills, setAiSkills] = useState([]);
	const [editingAiSkill, setEditingAiSkill] = useState(null);
	const [editAiForm, setEditAiForm] = useState({name: '', category: '', family: '', type: '', level: '', domain: '', market_demand: 0, experience: 0});

	// Languages state
	const [languages, setLanguages] = useState([]);
	const [showLanguageModal, setShowLanguageModal] = useState(false);
	const [editingLanguage, setEditingLanguage] = useState(null);
	const [languageForm, setLanguageForm] = useState({name: '', level: 'Basic', proficiency: 0});

	// Checklist state
	const [checklistItems, setChecklistItems] = useState([]);
	const [showChecklistModal, setShowChecklistModal] = useState(false);
	const [editingChecklistItem, setEditingChecklistItem] = useState(null);
	const [checklistForm, setChecklistForm] = useState({title: '', completed: false});

	// Photo and top skills
	const [photoPreview, setPhotoPreview] = useState(null);
	const [showTopSkillsModal, setShowTopSkillsModal] = useState(false);
	const photoInputRef = useRef(null);
	const [employeeNotifications, setEmployeeNotifications] = useState([]);
	const [showNotificationPanel, setShowNotificationPanel] = useState(false);

	// Save languages to localStorage whenever they change
	useEffect(() => {
		if (profile?.id && languages.length > 0) {
			localStorage.setItem(`employeeLanguages_${profile.id}`, JSON.stringify(languages));
		}
	}, [languages, profile?.id]);

	// Save checklist to localStorage whenever it changes
	useEffect(() => {
		if (profile?.id && checklistItems.length > 0) {
			localStorage.setItem(`employeeChecklist_${profile.id}`, JSON.stringify(checklistItems));
		}
	}, [checklistItems, profile?.id]);

	// Save skills to localStorage whenever they change
	useEffect(() => {
		if (profile?.id) {
			localStorage.setItem(`employeeSkills_${profile.id}`, JSON.stringify(skills));
		}
	}, [skills, profile?.id]);

	// Save AI skills to localStorage whenever they change
	useEffect(() => {
		if (profile?.id) {
			localStorage.setItem(`employeeAiSkills_${profile.id}`, JSON.stringify(aiSkills));
		}
	}, [aiSkills, profile?.id]);

	useEffect(() => {
		const token = localStorage.getItem("authToken");
		if (!token) return;

		apiClient("/auth/me")
			.then((p) => setProfile(p))
			.catch(() => setProfile(null));
	}, []);

	useEffect(() => {
		if (!profile?.id) return;

		// Load per-user data from localStorage
		setSkills(getStoredSkills(profile.id));
		setLanguages(getStoredLanguages(profile.id));
		setChecklistItems(getStoredChecklist(profile.id));

		// Load photo
		const savedPhoto = localStorage.getItem(`employeePhoto_${profile.id}`);
		if (savedPhoto) setPhotoPreview(savedPhoto);

		apiClient(`/documents/cv-skills/${profile.id}`)
			.then(data => {
				const parsed = typeof data === "string" ? JSON.parse(data) : data;
				const backendSkills = parsed.skills || [];
				const storedSkills = getStoredAiSkills(profile.id);
				
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
			.catch(() => {
				// Pas de CV uploadé → vider les skills IA
				setAiSkills([]);
				localStorage.removeItem(`employeeAiSkills_${profile.id}`);
			});

		getEmployeeNotifications(profile.id)
			.then((items) => setEmployeeNotifications(Array.isArray(items) ? items : []))
			.catch(() => setEmployeeNotifications([]));
	}, [profile]);

	const formatNotificationScore = (score) => {
		if (score == null || Number.isNaN(Number(score))) return "-";
		return Number(score).toFixed(2);
	};

	const renderNotificationBell = () => {
		const count = employeeNotifications.length;
		return (
			<div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '12px' }}>
				<button
					type="button"
					onClick={() => setShowNotificationPanel((prev) => !prev)}
					title="Project notifications"
					style={{
						position: 'relative',
						border: '1px solid #dbeafe',
						background: '#ffffff',
						borderRadius: '999px',
						padding: '8px 12px',
						cursor: 'pointer',
						fontSize: '1rem',
						fontWeight: 700,
						color: '#1d4ed8'
					}}
				>
					🔔 Notifications
					{count > 0 && (
						<span
							style={{
								position: 'absolute',
								top: '-6px',
								right: '-6px',
								minWidth: '20px',
								height: '20px',
								borderRadius: '999px',
								background: '#ef4444',
								color: '#fff',
								fontSize: '0.75rem',
								display: 'inline-flex',
								alignItems: 'center',
								justifyContent: 'center',
								padding: '0 6px'
							}}
						>
							{count}
						</span>
					)}
				</button>
			</div>
		);
	};

	const renderNotificationPanel = () => {
		if (!showNotificationPanel) return null;

		return (
			<div
				style={{
					marginBottom: '20px',
					padding: '14px',
					borderRadius: '14px',
					background: '#ffffff',
					border: '1px solid #e5e7eb',
					boxShadow: '0 10px 24px rgba(17, 24, 39, 0.08)'
				}}
			>
				<div style={{ fontWeight: 700, color: '#1f2937', marginBottom: '12px' }}>
					Voir recommandations par projet
				</div>

				{employeeNotifications.length === 0 && (
					<div style={{ color: '#6b7280' }}>Aucune notification pour le moment.</div>
				)}

				{employeeNotifications.map((item, idx) => (
					<div
						key={`${item.projectId}-${idx}`}
						style={{
							border: '1px solid #e5e7eb',
							borderRadius: '12px',
							padding: '12px',
							marginBottom: '10px',
							background: item.assigned ? '#ecfdf5' : '#eff6ff'
						}}
					>
						<div style={{ fontWeight: 700, color: '#111827' }}>{item.projectName}</div>
						<div style={{ color: '#374151', fontSize: '0.92rem', marginTop: '4px' }}>
							Manager: <strong>{item.managerName || '-'}</strong>
						</div>
						<div style={{ color: '#374151', fontSize: '0.92rem', marginTop: '4px' }}>
							Type: {item.assigned ? 'Assignment' : 'Matching'}
						</div>
						<div style={{ color: '#374151', fontSize: '0.92rem', marginTop: '4px' }}>
							Score: <strong>{formatNotificationScore(item.score)}</strong>
						</div>
						<div style={{ color: '#374151', fontSize: '0.92rem', marginTop: '4px' }}>
							Missing skills: {(item.missingSkills || []).length > 0 ? item.missingSkills.join(', ') : 'None'}
						</div>
						<div style={{ color: '#374151', fontSize: '0.92rem', marginTop: '4px' }}>
							Recommended courses:
							<ul style={{ margin: '6px 0 0 18px' }}>
								{(item.recommendedCourses || []).length > 0 ? (
									item.recommendedCourses.map((course, cIdx) => <li key={`${item.projectId}-${cIdx}`}>{course}</li>)
								) : (
									<li>No recommendation</li>
								)}
							</ul>
						</div>
					</div>
				))}
			</div>
		);
	};

	useEffect(() => {
		if (activeSection === 'skills') {
			const section = document.getElementById('skills');
			if (section) {
				section.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
		}
	}, [activeSection]);

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
		if (!file) {
			alert("Veuillez sélectionner un CV avant de l'envoyer.");
			return;
		}
		if (!profile?.id) {
			alert("Profil introuvable. Veuillez vous reconnecter ou charger votre profil.");
			return;
		}
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
			family: skill.family || '',
			type: skill.type || '',
			level: skill.level || '',
			domain: skill.domain || '',
			market_demand: skill.market_demand || 0,
			experience: skill.experience || 0
		});
	}

	function cancelEditingAiSkill() {
		setEditingAiSkill(null);
		setEditAiForm({name: '', category: '', family: '', type: '', level: '', domain: '', market_demand: 0, experience: 0});
	}

	function saveAiSkill(index) {
		setAiSkills(aiSkills.map((s, i) =>
			i === index
				? {...s, ...editAiForm}
				: s
		));
		setEditingAiSkill(null);
		setEditAiForm({name: '', category: '', domain: '', family: '', type: '', market_demand: 0, experience: 0});
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

	const combinedSkills = Array.from(new Set([
		...skills.map(skill => skill.name?.trim()).filter(Boolean),
		...aiSkills.map(skill => (typeof skill === 'string' ? skill.trim() : skill.name?.trim())).filter(Boolean),
	]));
	
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

	// Photo management functions
	function handlePhotoChange(e) {
		const file = e.target.files?.[0];
		if (!file) return;
		
		if (file.size > 5 * 1024 * 1024) {
			alert("La photo doit être moins de 5MB");
			return;
		}
		
		const reader = new FileReader();
		reader.onloadend = () => {
			setPhotoPreview(reader.result);
			if (profile?.id) localStorage.setItem(`employeePhoto_${profile.id}`, reader.result);
		};
		reader.readAsDataURL(file);
	}

	// Photo is loaded in the profile useEffect above

	// Get best skills (top 5)
	const getBestSkills = () => {
		return skills
			.sort((a, b) => {
				const levelOrder = { 'Expert': 4, 'Professional': 3, 'Intermediate': 2, 'Basic': 1 };
				return (levelOrder[b.level] || 0) - (levelOrder[a.level] || 0);
			})
			.slice(0, 5);
	};

	if (activeSection === 'recommendations') {
		return (
			<div className="profile-with-sidebar">
				<Sidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					notificationsCount={employeeNotifications.length}
					onOpenNotifications={() => setActiveSection('recommendations')}
				/>
				<div className="profile-layout" style={{ padding: 0, background: 'transparent' }}>
					<EmployeeRecommendations notifications={employeeNotifications} />
				</div>
			</div>
		);
	}

	if (activeSection === 'overview') {
		return (
			<div className="profile-with-sidebar">
				<Sidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					notificationsCount={employeeNotifications.length}
					onOpenNotifications={() => setActiveSection('recommendations')}
				/>
				<div className="profile-layout">
					<Overview />
				</div>
			</div>
		);
	}

	if (activeSection === 'dashboard') {
		return (
			<div className="profile-with-sidebar">
				<Sidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					notificationsCount={employeeNotifications.length}
					onOpenNotifications={() => setActiveSection('recommendations')}
				/>
				<div className="profile-layout">
					<Dashboardemploye skills={skills} aiSkills={aiSkills} notifications={employeeNotifications} />
				</div>
			</div>
		);
	}

	if (activeSection === 'skills') {
		return (
			<div className="profile-with-sidebar">
				<Sidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					notificationsCount={employeeNotifications.length}
					onOpenNotifications={() => setActiveSection('recommendations')}
				/>
				<div className="profile-layout">
					<div className="employee-profile">
						<SkillSection
							sectionId="skills"
							aiSkills={aiSkills}
							editingAiSkill={editingAiSkill}
							editAiForm={editAiForm}
							onStartEditingAiSkill={startEditingAiSkill}
							onCancelEditingAiSkill={cancelEditingAiSkill}
							onSaveAiSkill={saveAiSkill}
							onDeleteAiSkill={deleteAiSkill}
							onAiEditInputChange={handleAiEditInputChange}
						/>
					</div>
				</div>
			</div>
		);
	}

	if (activeSection === 'career') {
		return (
			<div className="profile-with-sidebar">
				<Sidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					notificationsCount={employeeNotifications.length}
					onOpenNotifications={() => setActiveSection('recommendations')}
				/>
				<div className="profile-layout">
					<div className="employee-profile">
						<CareerPage employeeSkills={combinedSkills} />
					</div>
				</div>
			</div>
		);
	}

	if (activeSection === 'resume') {
		return (
			<div className="profile-with-sidebar">
				<Sidebar
					activeSection={activeSection}
					onSectionChange={setActiveSection}
					notificationsCount={employeeNotifications.length}
					onOpenNotifications={() => setActiveSection('recommendations')}
				/>
				<div className="profile-layout">
					<div className="employee-profile">
						<ResumePage
							file={file}
							dragActive={dragActive}
							profile={profile}
							uploading={uploading}
							progress={progress}
							fileInputRef={fileInputRef}
							onDrag={onDrag}
							onDrop={onDrop}
							handleFiles={handleFiles}
							uploadCv={uploadCv}
							setFile={setFile}
						/>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="profile-with-sidebar">
			<Sidebar
				activeSection={activeSection}
				onSectionChange={setActiveSection}
				notificationsCount={employeeNotifications.length}
				onOpenNotifications={() => setActiveSection('recommendations')}
			/>
			<div className="profile-layout">
				<div className="employee-profile">
			{/* Enhanced Header Section */}
			<div className="profile-header-section">
				<div className="profile-header-container">
					{/* Left: Photo and Basic Info */}
					<div className="profile-header-left">
						<div className="profile-photo-container">
							{photoPreview ? (
								<img src={photoPreview} alt="Profile" className="profile-photo" />
							) : (
								<div className="profile-photo placeholder">
									<span className="photo-initials">{profile?.prenom?.[0]}{profile?.nom?.[0]}</span>
								</div>
							)}
							<button 
								className="photo-upload-btn"
								onClick={() => photoInputRef.current?.click()}
								title="Cliquez pour uploader une photo"
							>
								📷
							</button>
							<input
								ref={photoInputRef}
								type="file"
								accept="image/jpeg,image/png,image/webp"
								style={{ display: 'none' }}
								onChange={handlePhotoChange}
							/>
						</div>
						<div className="profile-basic-info">
							<div className="info-row">
								<label>Nom</label>
								<span>{profile?.nom || "Non renseigné"}</span>
							</div>
							<div className="info-row">
								<label>Prénom</label>
								<span>{profile?.prenom || "Non renseigné"}</span>
							</div>
							<div className="info-row">
								<label>Email</label>
								<span>{profile?.email || "Non renseigné"}</span>
							</div>
							<div className="info-row">
								<label>Téléphone</label>
								<span>{profile?.phone || "Non renseigné"}</span>
							</div>
						</div>
					</div>

					{/* Right: Role and Details */}
					<div className="profile-header-right">
						<div className="profile-header-main">
							<h1 className="profile-name">{profile ? `${profile.prenom} ${profile.nom}` : "Profil Employé"}</h1>
							<div className="profile-role-badge">
								<span className="role-icon">💼</span>
								<span className="role-text">{profile?.position || "Professionnel"}</span>
							</div>
							<p className="profile-company">🏢 {profile?.company || "Entreprise non spécifiée"}</p>
						</div>
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

			{/* Best Skills Table Section */}
			{getBestSkills().length > 0 && (
				<div className="best-skills-section">
					<div className="section-header">
						<h2>🎯 Meilleures Compétences</h2>
						<span className="best-skills-count">{getBestSkills().length} compétence{getBestSkills().length > 1 ? 's' : ''}</span>
					</div>
					<div className="best-skills-table-container">
						<table className="best-skills-table">
							<thead>
								<tr>
									<th className="col-rank">#</th>
									<th className="col-skill">Compétence</th>
									<th className="col-level">Niveau</th>
									<th className="col-experience">Expérience</th>
									<th className="col-proficiency">Maîtrise</th>
								</tr>
							</thead>
							<tbody>
								{getBestSkills().map((skill, idx) => {
									const levelOrder = { 'Expert': 4, 'Professional': 3, 'Intermediate': 2, 'Basic': 1 };
									const proficiency = ((levelOrder[skill.level] || 0) / 4) * 100;
									return (
										<tr key={skill.id} className={`skill-row level-${skill.level.toLowerCase()}`}>
											<td className="col-rank">
												<span className="rank-badge">
													{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}.`}
												</span>
											</td>
											<td className="col-skill">
												<div className="skill-name-cell">
													<span className="skill-name-text">{skill.name}</span>
												</div>
											</td>
											<td className="col-level">
												<span className={`level-badge level-${skill.level.toLowerCase()}`}>
													{skill.level}
												</span>
											</td>
											<td className="col-experience">
												<span className="experience-badge">
													{skill.experience} {skill.experience > 1 ? 'mois' : 'mois'}
												</span>
											</td>
											<td className="col-proficiency">
												<div className="proficiency-bar">
													<div className="proficiency-fill" style={{width: `${proficiency}%`}}></div>
												</div>
												<span className="proficiency-text">{proficiency.toFixed(0)}%</span>
											</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			)}

			<div className="recommendation-section">
				<CareerRecommendationForm employeeSkills={combinedSkills} />
			</div>

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
				</div>
			</div>

			<SkillSection
				sectionId="skills"
				aiSkills={aiSkills}
				editingAiSkill={editingAiSkill}
				editAiForm={editAiForm}
				onStartEditingAiSkill={startEditingAiSkill}
				onCancelEditingAiSkill={cancelEditingAiSkill}
				onSaveAiSkill={saveAiSkill}
				onDeleteAiSkill={deleteAiSkill}
				onAiEditInputChange={handleAiEditInputChange}
			/>
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
		</div>
	</div>
	);

}

