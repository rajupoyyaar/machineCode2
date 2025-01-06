import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [applications, setApplications] = useState([]);
  const [currentAppId, setCurrentAppId] = useState(null);
  const [currentDocId, setCurrentDocId] = useState(null);
  const [isAppPopupOpen, setIsAppPopupOpen] = useState(false);
  const [isDocPopupOpen, setIsDocPopupOpen] = useState(false);
  const [newAppName, setNewAppName] = useState("");
  const [newDocName, setNewDocName] = useState("");

  // Automatically set the first document of the first application as selected
  // useEffect(() => {
  //   if (applications.length > 0 && currentAppId === null) {
  //     const firstApp = applications[0];
  //     setCurrentAppId(firstApp.id);
  //     if (firstApp.documents.length > 0) {
  //       setCurrentDocId(firstApp.documents[0].id);
  //     }
  //   }
  // }, [applications]);

  const addApplication = () => {
    const newAppId = applications.length + 1;
    setApplications([
      ...applications,
      { id: newAppId, name: newAppName, documents: [] },
    ]);
    setNewAppName("");
    setIsAppPopupOpen(false);
    if (!currentAppId) {
      setCurrentAppId(newAppId);
    }
  };

  const addDocument = () => {
    setApplications(
      applications.map((app) =>
        app.id === currentAppId
          ? {
              ...app,
              documents: [
                ...app.documents,
                { id: app.documents.length + 1, name: newDocName },
              ],
            }
          : app
      )
    );
    setNewDocName("");
    setIsDocPopupOpen(false);
  };

  const deleteApplication = (id) => {
    const updatedApps = applications.filter((app) => app.id !== id);
    setApplications(updatedApps);
    if (currentAppId === id) {
      if (updatedApps.length > 0) {
        setCurrentAppId(updatedApps[0].id);
        setCurrentDocId(
          updatedApps[0].documents.length > 0
            ? updatedApps[0].documents[0].id
            : null
        );
      } else {
        setCurrentAppId(null);
        setCurrentDocId(null);
      }
    }
  };

  const deleteDocument = (docId) => {
    setApplications(
      applications.map((app) =>
        app.id === currentAppId
          ? {
              ...app,
              documents: app.documents.filter((doc) => doc.id !== docId),
            }
          : app
      )
    );
    if (currentDocId === docId) {
      const currentApp = applications.find((app) => app.id === currentAppId);
      if (currentApp.documents.length > 1) {
        setCurrentDocId(currentApp.documents[0].id);
      } else {
        setCurrentDocId(null);
      }
    }
  };

  const handleNext = () => {
    const currentApp = applications.find((app) => app.id === currentAppId);
    const currentDocIndex = currentApp.documents.findIndex(
      (doc) => doc.id === currentDocId
    );

    if (currentDocIndex < currentApp.documents.length - 1) {
      setCurrentDocId(currentApp.documents[currentDocIndex + 1].id);
    } else {
      const nextAppIndex = applications.findIndex(
        (app) => app.id === currentAppId
      ) + 1;
      if (nextAppIndex < applications.length) {
        const nextApp = applications[nextAppIndex];
        setCurrentAppId(nextApp.id);
        setCurrentDocId(nextApp.documents[0]?.id || null);
      }
    }
  };

  const handleBack = () => {
    const currentApp = applications.find((app) => app.id === currentAppId);
    const currentDocIndex = currentApp.documents.findIndex(
      (doc) => doc.id === currentDocId
    );

    if (currentDocIndex > 0) {
      setCurrentDocId(currentApp.documents[currentDocIndex - 1].id);
    } else {
      const prevAppIndex = applications.findIndex(
        (app) => app.id === currentAppId
      ) - 1;
      if (prevAppIndex >= 0) {
        const prevApp = applications[prevAppIndex];
        setCurrentAppId(prevApp.id);
        setCurrentDocId(
          prevApp.documents.length > 0
            ? prevApp.documents[prevApp.documents.length - 1].id
            : null
        );
      }
    }
  };

  const currentApp = applications.find((app) => app.id === currentAppId);
  const currentDoc = currentApp?.documents.find((doc) => doc.id === currentDocId);

  return (
    <div className="app">
      <header>
        <button
          className="add-app-btn"
          onClick={() => setIsAppPopupOpen(true)}
        >
          + Add Applicant
        </button>
      </header>

      {applications.length > 0 && (
        <div className="topbar">
          {applications.map((app) => (
            <div
              key={app.id}
              className={`app-item ${currentAppId === app.id ? "active" : ""}`}
              onClick={() => setCurrentAppId(app.id)}
            >
              {app.name}
              <button
                className="delete-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  deleteApplication(app.id);
                }}
              >
                X
              </button>
            </div>
          ))}
        </div>
      )}

      {applications.length > 0 && (
        <div className="main-container">
          <aside className="sidebar">
            {currentApp?.documents.map((doc) => (
              <div
                key={doc.id}
                className={`doc-item ${currentDocId === doc.id ? "active" : ""}`}
                onClick={() => setCurrentDocId(doc.id)}
              >
                {doc.name}
                <button
                  className="delete-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteDocument(doc.id);
                  }}
                >
                  X
                </button>
              </div>
            ))}
            <button
              className="add-btn"
              onClick={() => setIsDocPopupOpen(true)}
            >
              + Add Document
            </button>
          </aside>
          <main className="content">
            {currentDoc ? (
              <>
                <h1>
                  Upload to {currentApp.name} - {currentDoc.name}
                </h1>
                <input type="file" className="upload-input" />
              </>
            ) : currentApp && currentApp.documents.length === 0 ? (
              <p>No documents available</p>
            ) : null}
          </main>
        </div>
      )}

      <footer className="footer">
        <button className="nav-btn" onClick={handleBack}>
          Back
        </button>
        <button className="nav-btn" onClick={handleNext}>
          Next
        </button>
      </footer>

      {isAppPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Applicant</h2>
            <input
              type="text"
              value={newAppName}
              onChange={(e) => setNewAppName(e.target.value)}
              placeholder="Enter application name"
            />
            <div className="popup-actions">
              <button className="save-btn" onClick={addApplication}>
                Save
              </button>
              <button
                className="close-btn"
                onClick={() => setIsAppPopupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {isDocPopupOpen && (
        <div className="popup">
          <div className="popup-content">
            <h2>Add Document</h2>
            <input
              type="text"
              value={newDocName}
              onChange={(e) => setNewDocName(e.target.value)}
              placeholder="Enter document name"
            />
            <div className="popup-actions">
              <button className="save-btn" onClick={addDocument}>
                Save
              </button>
              <button
                className="close-btn"
                onClick={() => setIsDocPopupOpen(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
