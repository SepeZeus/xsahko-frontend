import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Header from "./Header";
import Footer from "./Footer";
import "../styles/ContactPage.css";

const ContactPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleBackToHomepage = () => {
    navigate("/");
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="contact-page">
      <Header />
      <div className="contact-content">
        <div className="contact-container">
          <button className="back-button" onClick={handleBackToHomepage}>
            {t("back")} {/* Assuming you have a translation key for "Back" */}
          </button>
          <form className="contact-form" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="name">{t("ContactPage.Name")}</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="email">{t("ContactPage.Email")}</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label htmlFor="message">{t("ContactPage.Message")}</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit">{t("ContactPage.Submit")}</button>
          </form>
          <div className="info-boxes">
            <div className="info-box black-box">
              <p className="bold-text">{t("MainCampus.SchoolName")}</p>
              <p>{t("MainCampus.StreetAddress")}</p>
              <p>{t("MainCampus.PostalCode")}</p>
              <p>{t("MainCampus.BusinessID")}</p>
            </div>
            <div className="info-box yellow-box">
              <p className="bold-text">{t("MikkeliCampus.SchoolName")}</p>
              <p>{t("MikkeliCampus.StreetAddress")}</p>
              <p>{t("MikkeliCampus.PostalCode")}</p>
              <p>{t("MikkeliCampus.CampusContact")}</p>
              <p>{t("MikkeliCampus.XSahkoContact")}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
