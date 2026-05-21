import React from "react";
import { Link } from "react-router-dom";
import HomeLayout from "../layouts/HomeLayout";

export default function Home() {
  const portals = [
    { title: "Admin Portal", path: "/admin/login", color: "bg-secondary" },
    { title: "Instructor Portal", path: "/instructor/login", color: "bg-dark" },
    { title: "Student Portal", path: "/student/login", color: "bg-secondary" },
  ];

  return (
    <HomeLayout>
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ minHeight: "85vh" }}>
        <h1 className="fw-bold text-secondary mb-2">University Management System</h1>
        <p className="text-muted mb-5">Select your portal to continue</p>
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {portals.map((portal, index) => (
            <Link
              key={index}
              to={portal.path}
              className={`card text-white ${portal.color} shadow border-0 text-decoration-none`}
              style={{ width: "16rem", borderRadius: "16px" }}
            >
              <div className="card-body text-center py-5">
                <h4 className="card-title fw-bold">{portal.title}</h4>
                <p className="card-text small mt-2 opacity-75">Click to login</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </HomeLayout>
  );
}
