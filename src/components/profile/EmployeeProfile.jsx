import React, { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiClient, BASE_URL } from "../../api/apiClient";
import "./EmployeeProfile.css";
import SkillGraph from "../SkillGraph";

export default function EmployeeProfile() {
	//const { user } = useAuth();
	const [profile, setProfile] = useState(null);
	const [dragActive, setDragActive] = useState(false);
	const [file, setFile] = useState(null);
	const [uploading, setUploading] = useState(false);
	const [progress, setProgress] = useState(0);
	const [showSkillModal, setShowSkillModal] = useState(false);
	const [skills, setSkills] = useState([
		{id: 1, name: 'Python', level: 'Expert', experience: 5},
		{id: 2, name: 'JavaScript', level: 'Professional', experience: 4},
		{id: 3, name: 'React', level: 'Professional', experience: 3},
	]);
	const [newSkill, setNewSkill] = useState({name: '', level: 'Basic', experience: 0});
	const fileInputRef = useRef(null);

	useEffect(() => {
	const token = localStorage.getItem("authToken");
	if (!token) return;

	apiClient("/auth/me")
		.then((p) => setProfile(p))
		.catch(() => setProfile(null));
}, []);


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
					// use backend base URL to ensure upload goes to the API server (not the dev server)
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

			// Rafraîchir le profil
			const fresh = await apiClient(`/profile/${profile.id}`);

			setProfile(fresh);
			setFile(null);
			alert("✅ CV uploadé avec succès!");
		} catch (err) {
			console.error("Upload error:", err);
			alert("❌ " + (err.message || "Échec de l'upload. Réessayez."));
		} finally {
			setUploading(false);
			setProgress(0);
		}
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

	function handleSkillInputChange(e) {
		const { name, value } = e.target;
		setNewSkill(prev => ({
			...prev,
			[name]: name === 'experience' ? parseInt(value) || 0 : value
		}));
	}

	return (
		<div className="profile-page">
			<div className="profile-container">
				<div className="profile-header">
					<h1>{profile ? `${profile.prenom} ${profile.nom}` : "Profil Employé"}</h1>
					<p>{profile?.position || "Professionnel"}</p>
				</div>

				<aside className="profile-info">
					<div className="info-card">
						<div className="info-row">
							<div className="info-icon">📧</div>
							<div className="info-text">
								<div className="info-label">Email</div>
								<div className="info-value">{profile?.email}</div>
							</div>
						</div>

						<div className="info-row">
							<div className="info-icon">📱</div>
							<div className="info-text">
								<div className="info-label">Téléphone</div>
								<div className="info-value">{profile?.phone || "Non fourni"}</div>
							</div>
						</div>

						<div className="info-row">
							<div className="info-icon">🏢</div>
							<div className="info-text">
								<div className="info-label">Entreprise</div>
								<div className="info-value">{profile?.company || "Non spécifiée"}</div>
							</div>
						</div>

						<div className="info-row">
							<div className="info-icon">🆔</div>
							<div className="info-text">
								<div className="info-label">Employé ID</div>
								<div className="info-value">{profile?.id || "-"}</div>
							</div>
						</div>
					</div>
				</aside>

				<div style={{gridColumn: 1, gridRow: 3, background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 10px 40px rgba(0, 0, 0, 0.15)', border: '1px solid rgba(255, 255, 255, 0.8)'}}>
					<h3 style={{fontSize: '16px', fontWeight: 700, color: '#1a202c', marginTop: 0, marginBottom: '16px'}}>⭐ Compétences Clés</h3>
					<SkillGraph compact />
				</div>

				<main className="cv-upload">
					<h2>📄 Chargez Votre CV</h2>
					<div className={`dropzone ${dragActive ? 'active' : ''}`} onDragEnter={onDrag} onDragOver={onDrag} onDragLeave={onDrag} onDrop={onDrop}>
						<input ref={fileInputRef} type="file" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" style={{ display: 'none' }} onChange={(e) => handleFiles(e.target.files)} />
						{!file ? (
							<>
								<p style={{fontSize: '32px', margin: '0 0 12px'}}>📤</p>
								<p style={{fontSize: '16px', fontWeight: 600}}>Déposez votre CV ici</p>
								<p>ou <button className="link-btn" onClick={() => fileInputRef.current?.click()}>sélectionnez un fichier</button></p>
								<small style={{color: '#a0aec0', display: 'block', marginTop: '12px'}}>PDF, Word • Max 10MB</small>
							</>
						) : (
							<>
								<p style={{fontSize: '28px', margin: '0 0 12px'}}>📋</p>
								<p style={{fontWeight: 600, color: '#1a202c'}}>{file.name}</p>
								<small style={{color: '#718096'}}>{(file.size/1024).toFixed(0)} KB</small>
								<p><button className="link-btn" onClick={() => setFile(null)}>✕ Supprimer le fichier</button></p>
							</>
						)}
					</div>
					{profile?.cvPath && !file && (
						<p style={{marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e2e8f0', color: '#4a5568'}}>
							CV actuel: <a href={profile.cvPath} target="_blank" rel="noreferrer" style={{color: '#667eea', fontWeight: 700, textDecoration: 'none'}}>Télécharger</a>
						</p>
					)}
					<button className="upload-btn" onClick={uploadCv} disabled={!file || uploading}>{uploading ? `⏳ Upload ${progress}% ...` : '⬆️ Envoyer le CV'}</button>
					{uploading && <div className="progress"><div className="bar" style={{ width: `${progress}%` }} /></div>}

					{/* Skills Management Section */}
					<div style={{marginTop: '40px', paddingTop: '30px', borderTop: '2px solid #e2e8f0'}}>
						<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
							<h2 style={{margin: 0, color: '#1a202c'}}>💼 Mes Compétences</h2>
							<button 
								className="upload-btn" 
								onClick={() => setShowSkillModal(true)}
								style={{fontSize: '14px', padding: '10px 20px'}}
							>
								+ Ajouter une compétence
							</button>
						</div>

						{skills.length === 0 ? (
							<p style={{color: '#718096', textAlign: 'center', padding: '20px'}}>Aucune compétence ajoutée. Commencez par en ajouter une.</p>
						) : (
							<div style={{overflowX: 'auto'}}>
								<table style={{width: '100%', borderCollapse: 'collapse'}}>
									<thead>
										<tr style={{backgroundColor: 'linear-gradient(135deg, #667eea, #764ba2)', color: 'white'}}>
											<th style={{padding: '12px', textAlign: 'left', borderBottom: '2px solid #667eea'}}>Compétence</th>
											<th style={{padding: '12px', textAlign: 'center', borderBottom: '2px solid #667eea', width: '120px'}}>Niveau</th>
											<th style={{padding: '12px', textAlign: 'center', borderBottom: '2px solid #667eea', width: '140px'}}>Expérience (mois)</th>
											<th style={{padding: '12px', textAlign: 'center', borderBottom: '2px solid #667eea', width: '100px'}}>Actions</th>
										</tr>
									</thead>
									<tbody>
										{skills.map((skill) => (
											<tr key={skill.id} style={{borderBottom: '1px solid #e2e8f0', transition: 'all 0.3s ease'}}>
												<td style={{padding: '12px', fontWeight: 600, color: '#1a202c'}}>{skill.name}</td>
												<td style={{padding: '12px', textAlign: 'center'}}>
													<span style={{
														display: 'inline-block',
														padding: '6px 12px',
														borderRadius: '20px',
														fontSize: '12px',
														fontWeight: 700,
														backgroundColor: skill.level === 'Expert' ? '#f6d55c' : 
																		skill.level === 'Professional' ? '#667eea' :
																		skill.level === 'Intermediate' ? '#52b788' : '#cbd5e0',
														color: skill.level === 'Expert' ? '#744210' : 'white'
													}}>
														{skill.level}
													</span>
												</td>
												<td style={{padding: '12px', textAlign: 'center', color: '#4a5568'}}>{skill.experience} mois</td>
												<td style={{padding: '12px', textAlign: 'center'}}>
													<button 
														onClick={() => deleteSkill(skill.id)}
														style={{
															backgroundColor: '#fc5a6f',
															color: 'white',
															border: 'none',
															padding: '6px 12px',
															borderRadius: '6px',
															cursor: 'pointer',
															fontSize: '12px',
															fontWeight: 600,
															transition: 'all 0.3s ease'
														}}
														onMouseEnter={(e) => e.target.style.backgroundColor = '#e63946'}
														onMouseLeave={(e) => e.target.style.backgroundColor = '#fc5a6f'}
													>
														Supprimer
													</button>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
						)}
					</div>
				</main>

				{/* Skills Modal */}
				{showSkillModal && (
					<div style={{
						position: 'fixed',
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex',
						justifyContent: 'center',
						alignItems: 'center',
						zIndex: 1000,
						backdropFilter: 'blur(5px)'
					}}>
						<div style={{
							backgroundColor: 'white',
							borderRadius: '16px',
							padding: '30px',
							boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
							width: '90%',
							maxWidth: '450px',
							animation: 'slideUp 0.3s ease'
						}}>
							<div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px'}}>
								<h2 style={{margin: 0, color: '#1a202c'}}>Ajouter une Compétence</h2>
								<button 
									onClick={() => setShowSkillModal(false)}
									style={{backgroundColor: 'transparent', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#718096'}}
								>
									✕
								</button>
							</div>

							<form onSubmit={(e) => {e.preventDefault(); addSkill()}}>
								<div style={{marginBottom: '20px'}}>
									<label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2d3748'}}>Nom de la compétence</label>
									<input 
										type="text" 
										name="name"
										value={newSkill.name}
										onChange={handleSkillInputChange}
										placeholder="Ex: Python, JavaScript, React"
										style={{
											width: '100%',
											padding: '12px',
											borderRadius: '8px',
											border: '1px solid #cbd5e0',
											fontSize: '14px',
											boxSizing: 'border-box',
											transition: 'all 0.3s ease'
										}}
									/>
								</div>

								<div style={{marginBottom: '20px'}}>
									<label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2d3748'}}>Niveau</label>
									<select 
										name="level"
										value={newSkill.level}
										onChange={handleSkillInputChange}
										style={{
											width: '100%',
											padding: '12px',
											borderRadius: '8px',
											border: '1px solid #cbd5e0',
											fontSize: '14px',
											boxSizing: 'border-box',
											cursor: 'pointer'
										}}
									>
										<option value="Basic">Basique</option>
										<option value="Intermediate">Intermédiaire</option>
										<option value="Professional">Professionnel</option>
										<option value="Expert">Expert</option>
									</select>
								</div>

								<div style={{marginBottom: '20px'}}>
									<label style={{display: 'block', marginBottom: '8px', fontWeight: 600, color: '#2d3748'}}>Expérience (mois)</label>
									<input 
										type="number" 
										name="experience"
										value={newSkill.experience}
										onChange={handleSkillInputChange}
										min="0"
										max="1200"
										placeholder="Ex: 24"
										style={{
											width: '100%',
											padding: '12px',
											borderRadius: '8px',
											border: '1px solid #cbd5e0',
											fontSize: '14px',
											boxSizing: 'border-box'
										}}
									/>
								</div>

								<div style={{display: 'flex', gap: '12px', justifyContent: 'flex-end'}}>
									<button 
										type="button"
										onClick={() => setShowSkillModal(false)}
										style={{
											padding: '12px 24px',
											borderRadius: '8px',
											border: '1px solid #cbd5e0',
											backgroundColor: '#f7fafc',
											color: '#2d3748',
											fontWeight: 600,
											cursor: 'pointer',
											transition: 'all 0.3s ease'
										}}
										onMouseEnter={(e) => e.target.style.backgroundColor = '#edf2f7'}
										onMouseLeave={(e) => e.target.style.backgroundColor = '#f7fafc'}
									>
										Annuler
									</button>
									<button 
										type="submit"
										style={{
											padding: '12px 24px',
											borderRadius: '8px',
											border: 'none',
											background: 'linear-gradient(135deg, #667eea, #764ba2)',
											color: 'white',
											fontWeight: 600,
											cursor: 'pointer',
											transition: 'all 0.3s ease',
											boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
										}}
										onMouseEnter={(e) => e.target.transform = 'translateY(-2px)'}
										onMouseLeave={(e) => e.target.transform = 'translateY(0)'}
									>
										Ajouter la compétence
									</button>
								</div>
							</form>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}

