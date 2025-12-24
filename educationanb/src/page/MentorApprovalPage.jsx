import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import Swal from "sweetalert2";
import '../assets/css/components/mentorapprove.css';

const MentorApprovalPage = () => {
  const [pendingMentors, setPendingMentors] = useState([]);
  const [stats, setStats] = useState({ total: 0, accepted: 0, rejected: 0, pending: 0 });
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingRes, statsRes] = await Promise.all([
        api.get('/admin/mentors/pending'),
        api.get('/admin/mentors/stats')
      ]);
      setPendingMentors(pendingRes.data);
      setStats(statsRes.data);
    } catch (err) {
      Swal.fire("Error", "Failed to load mentor data", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleReview = async (mentorId, action) => {
    const isAccept = action === 'accept';
    
    const result = await Swal.fire({
      title: `Confirm ${action.toUpperCase()}?`,
      text: isAccept 
        ? "The mentor will receive an approval email and gain platform access." 
        : "The mentor will be notified of the rejection via email.",
      icon: isAccept ? 'success' : 'warning',
      showCancelButton: true,
      confirmButtonColor: isAccept ? '#10B981' : '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: `Yes, ${action}!`
    });

    if (!result.isConfirmed) return;

    try {
      setProcessingId(mentorId);
      const res = await api.patch(`/admin/mentors/${mentorId}/review`, { action });
      
      await Swal.fire({
        icon: 'success',
        title: 'Updated!',
        text: res.data.message || `Mentor has been ${action}ed.`,
        timer: 1500,
        showConfirmButton: false
      });

      fetchData(); // Refresh list and stats
    } catch (err) {
      Swal.fire("Action Failed", err.response?.data?.message || "Internal server error", "error");
    } finally {
      setProcessingId(null);
    }
  };

  const exportExcel = () => {
    const ws = XLSX.utils.json_to_sheet(pendingMentors.map(m => ({
      'Full Name': `${m.first_name} ${m.last_name}`,
      Gender: m.gender,
      'Job Title': m.job_title,
      Position: m.position_name,
      'Applied Date': new Date(m.created_at).toLocaleDateString(),
    })));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Pending Mentors');
    XLSX.writeFile(wb, `Mentors_Report_${new Date().toLocaleDateString()}.xlsx`);
  };

  const printPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Pending Mentor Applications', 14, 20);
    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Report Generated: ${new Date().toLocaleString()}`, 14, 28);

    const tableColumn = ["Name", "Gender", "Job Title", "Position", "Applied Date"];
    const tableRows = pendingMentors.map(m => [
      `${m.first_name} ${m.last_name}`,
      m.gender || '-',
      m.job_title || '-',
      m.position_name || '-',
      new Date(m.created_at).toLocaleDateString()
    ]);

    doc.autoTable({
      startY: 35,
      head: [tableColumn],
      body: tableRows,
      theme: 'striped',
      headStyles: { fillColor: [79, 70, 229] }
    });

    doc.save('Mentor_Approval_Report.pdf');
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{height: '80vh'}}>
        <div className="spinner-grow text-primary" role="status"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid py-4 px-4">
      {/* Header Section */}
      <div className="row align-items-center mb-4">
        <div className="col-md-6">
          <h2 className="fw-bold text-dark mb-1">Mentor Management</h2>
          <p className="text-muted">Review, verify, and approve industry expert applications.</p>
        </div>
        <div className="col-md-6 text-md-end">
          <button className="btn btn-outline-primary shadow-sm me-2" onClick={exportExcel}>
            <i className="bi bi-file-earmark-excel me-1"></i> Excel
          </button>
          <button className="btn btn-primary shadow-sm" onClick={printPDF}>
            <i className="bi bi-printer me-1"></i> Print Report
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="row g-3 mb-4">
        {[
          { label: 'Total Applications', value: stats.total, color: 'primary', icon: 'people' },
          { label: 'Approved', value: stats.accepted, color: 'success', icon: 'check-circle' },
          { label: 'Rejected', value: stats.rejected, color: 'danger', icon: 'x-circle' },
          { label: 'Pending', value: stats.pending, color: 'warning', icon: 'clock' },
        ].map((stat, i) => (
          <div className="col-sm-6 col-xl-3" key={i}>
            <div className="card border-0 shadow-sm p-3">
              <div className="d-flex align-items-center">
                <div className={`badge bg-${stat.color} bg-opacity-10 text-${stat.color} p-3 rounded-3 me-3`}>
                   <h4 className="mb-0">{stat.value}</h4>
                </div>
                <div>
                  <h6 className="text-muted mb-0">{stat.label}</h6>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Section */}
      <div className="card border-0 shadow-sm rounded-4 overflow-hidden">
        <div className="card-header bg-white border-0 py-3">
          <h5 className="mb-0 fw-bold">Pending Requests</h5>
        </div>
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead className="bg-light text-muted">
              <tr>
                <th className="ps-4">APPLICANT</th>
                <th>ROLE INFO</th>
                <th>APPLIED ON</th>
                <th className="text-center">DOCUMENTS</th>
                <th className="text-end pe-4">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {pendingMentors.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-5 text-muted">No pending applications found.</td></tr>
              ) : (
                pendingMentors.map((mentor) => (
                  <tr key={mentor.id}>
                    <td className="ps-4">
                      <div className="d-flex align-items-center">
                        <div className="avatar-sm bg-light rounded-circle text-primary d-flex justify-content-center align-items-center fw-bold me-3" style={{width: 40, height: 40}}>
                          {mentor.first_name[0]}{mentor.last_name[0]}
                        </div>
                        <div>
                          <div className="fw-bold text-dark">{mentor.first_name} {mentor.last_name}</div>
                          <small className="text-muted">{mentor.gender || 'Not specified'}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="text-dark fw-medium">{mentor.job_title}</div>
                      <small className="badge bg-info bg-opacity-10 text-info">{mentor.position_name}</small>
                    </td>
                    <td>{new Date(mentor.created_at).toLocaleDateString()}</td>
                    <td className="text-center">
                      {mentor.document_url ? (
                        <a href={mentor.document_url} target="_blank" rel="noreferrer" className="btn btn-sm btn-link text-decoration-none">
                          View CV <i className="bi bi-box-arrow-up-right"></i>
                        </a>
                      ) : <span className="text-muted small">None</span>}
                    </td>
                    <td className="text-end pe-4">
                      <button className="btn btn-sm btn-light me-2" onClick={() => setSelectedMentor(mentor)}>
                        Details
                      </button>
                      <button 
                        className="btn btn-sm btn-success px-3 me-2" 
                        disabled={processingId === mentor.id}
                        onClick={() => handleReview(mentor.id, 'accept')}
                      >
                        {processingId === mentor.id ? '...' : 'Approve'}
                      </button>
                      <button 
                        className="btn btn-sm btn-outline-danger" 
                        disabled={processingId === mentor.id}
                        onClick={() => handleReview(mentor.id, 'reject')}
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedMentor && (
        <div className="modal fade show d-block" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div className="modal-header border-0 pb-0">
                <h5 className="fw-bold">Applicant Details</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedMentor(null)}></button>
              </div>
              <div className="modal-body py-4">
                <div className="row g-3">
                  <div className="col-6">
                    <label className="text-muted small d-block">Full Name</label>
                    <span className="fw-bold text-dark">{selectedMentor.first_name} {selectedMentor.last_name}</span>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small d-block">Gender</label>
                    <span className="text-dark">{selectedMentor.gender}</span>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small d-block">Job Title</label>
                    <span className="text-dark">{selectedMentor.job_title}</span>
                  </div>
                  <div className="col-6">
                    <label className="text-muted small d-block">Current Position</label>
                    <span className="text-dark">{selectedMentor.position_name}</span>
                  </div>
                  <div className="col-12">
                    <hr className="text-muted opacity-25" />
                    <label className="text-muted small d-block mb-2">Verification Document</label>
                    {selectedMentor.document_url ? (
                      <a href={selectedMentor.document_url} target="_blank" rel="noreferrer" className="btn btn-primary w-100">
                        Review Portfolio/CV
                      </a>
                    ) : <p className="text-warning small italic">No document uploaded by mentor.</p>}
                  </div>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button className="btn btn-light w-100" onClick={() => setSelectedMentor(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MentorApprovalPage;