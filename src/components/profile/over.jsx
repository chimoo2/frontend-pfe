import React, { useEffect, useState } from "react";
import { apiClient } from "../../api/apiClient";
import "./Overview.css";

export default function Overview() {
    const [profile, setProfile] = useState(null);
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
        nom: "",
        prenom: "",
        email: "",
        phone: "",
        position: "",
        company: ""
    });

    useEffect(() => {
        const saved = localStorage.getItem('overviewProfile');
        if (saved) {
            const parsed = JSON.parse(saved);
            setProfile(parsed);
            setForm({
                nom: parsed.nom || '',
                prenom: parsed.prenom || '',
                email: parsed.email || '',
                phone: parsed.phone || '',
                position: parsed.position || parsed.role || '',
                company: parsed.company || ''
            });
            return;
        }

        const token = localStorage.getItem("authToken");
        if (!token) return;

        apiClient("/auth/me")
            .then((p) => {
                setProfile(p);
                setForm({
                    nom: p?.nom || '',
                    prenom: p?.prenom || '',
                    email: p?.email || '',
                    phone: p?.phone || '',
                    position: p?.position || p?.role || '',
                    company: p?.company || ''
                });
            })
            .catch(() => setProfile(null));
    }, []);

    useEffect(() => {
        if (profile) {
            localStorage.setItem('overviewProfile', JSON.stringify(profile));
        }
    }, [profile]);

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
            position: profile?.position || profile?.role || '',
            company: profile?.company || ''
        });
    };

    const saveProfile = () => {
        const updated = {
            ...(profile || {}),
            nom: form.nom,
            prenom: form.prenom,
            email: form.email,
            phone: form.phone,
            position: form.position,
            company: form.company
        };
        setProfile(updated);
        setForm(updated);
        localStorage.setItem('overviewProfile', JSON.stringify(updated));
        setEditMode(false);
    };

    return (
        <div className="overview-container">
            <div className="profile-card">
                <div className="profile-header">
                    <div className="profile-avatar">
                        <span className="avatar-initials">
                            {(form.prenom?.[0] || 'C') + (form.nom?.[0] || 'H')}
                        </span>
                    </div>
                    <div className="profile-details">
                        <h1 className="profile-name">
                            {form.prenom} {form.nom}
                        </h1>
                        <div className="profile-role">
                            <span className="role-badge">💼 {form.position || 'Professionnel'}</span>
                        </div>
                    </div>
                </div>

                <div className="profile-fields">
                    <div className="profile-field-row">
                        <span className="profile-field-label">Nom</span>
                        {editMode ? (
                            <input
                                name="nom"
                                value={form.nom}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-field-value">{form.nom || 'Non renseigné'}</span>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <span className="profile-field-label">Prénom</span>
                        {editMode ? (
                            <input
                                name="prenom"
                                value={form.prenom}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-field-value">{form.prenom || 'Non renseigné'}</span>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <span className="profile-field-label">Email</span>
                        {editMode ? (
                            <input
                                name="email"
                                type="email"
                                value={form.email}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-field-value">{form.email || 'Non renseigné'}</span>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <span className="profile-field-label">Téléphone</span>
                        {editMode ? (
                            <input
                                name="phone"
                                type="tel"
                                value={form.phone}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-field-value">{form.phone || 'Non renseigné'}</span>
                        )}
                    </div>

                    <div className="profile-field-row">
                        <span className="profile-field-label">Rôle actuel</span>
                        {editMode ? (
                            <input
                                name="position"
                                value={form.position}
                                onChange={handleInputChange}
                                className="profile-input"
                            />
                        ) : (
                            <span className="profile-field-value">{form.position || 'Professionnel'}</span>
                        )}
                    </div>
                </div>

                <div className="profile-edit-actions">
                    {editMode ? (
                        <>
                            <button className="secondary-button" type="button" onClick={cancelEdit}>
                                Annuler
                            </button>
                            <button className="primary-button" type="button" onClick={saveProfile}>
                                Enregistrer
                            </button>
                        </>
                    ) : (
                        <button className="primary-button" type="button" onClick={startEdit}>
                            Modifier le profil
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
