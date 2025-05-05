import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddConcertForm() {
  const navigate = useNavigate();

  const [artists, setArtists] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [locations, setLocations] = useState([]);

  const [formData, setFormData] = useState({
    artist: '',
    organizer: '',
    location: '',
    concert_date: '',
    concert_time: '',
    duration_minutes: '',
  });

  useEffect(() => {
    axios.get('http://localhost:8000/api/artists/').then((res) => setArtists(res.data));
    axios.get('http://localhost:8000/api/organizers/').then((res) => setOrganizers(res.data));
    axios.get('http://localhost:8000/api/locations/').then((res) => setLocations(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/concerts/', formData);
    navigate('/');
  };

  const formContainerStyle = {
    maxWidth: '500px',
    margin: '0 auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    backgroundColor: '#f9f9f9',
    boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold'
  };

  const inputStyle = {
    width: '100%',
    padding: '8px',
    marginBottom: '15px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    boxSizing: 'border-box'
  };

  const buttonRowStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px'
  };

  const submitButtonStyle = {
    backgroundColor: '#90ee90',
    border: '1px solid #ccc',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '48%'
  };

  const backButtonStyle = {
    backgroundColor: '#eee',
    border: '1px solid #ccc',
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    width: '48%'
  };

  return (
    <div style={formContainerStyle}>
      <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Add New Concert</h2>
      <form onSubmit={handleSubmit}>
        <label style={labelStyle}>Artist:</label>
        <select name="artist" value={formData.artist} onChange={handleChange} required style={inputStyle}>
          <option value="">-- Select --</option>
          {artists.map(a => (
            <option key={a.id} value={a.id}>{a.artist_first_name} {a.artist_last_name}</option>
          ))}
        </select>

        <label style={labelStyle}>Organizer:</label>
        <select name="organizer" value={formData.organizer} onChange={handleChange} required style={inputStyle}>
          <option value="">-- Select --</option>
          {organizers.map(o => (
            <option key={o.id} value={o.id}>{o.organizer_first_name} {o.organizer_last_name}</option>
          ))}
        </select>

        <label style={labelStyle}>Location:</label>
        <select name="location" value={formData.location} onChange={handleChange} required style={inputStyle}>
          <option value="">-- Select --</option>
          {locations.map(l => (
            <option key={l.id} value={l.id}>{l.city}, {l.country}</option>
          ))}
        </select>

        <label style={labelStyle}>Date:</label>
        <input type="date" name="concert_date" value={formData.concert_date} onChange={handleChange} required style={inputStyle} />

        <label style={labelStyle}>Time:</label>
        <input type="time" name="concert_time" value={formData.concert_time} onChange={handleChange} required style={inputStyle} />

        <label style={labelStyle}>Duration (minutes):</label>
        <input
          type="number"
          name="duration_minutes"
          value={formData.duration_minutes || ''}
          onChange={handleChange}
          min="1"
          required
          style={inputStyle}
        />

        <div style={buttonRowStyle}>
          <button type="submit" style={submitButtonStyle}>Submit</button>
          <button type="button" onClick={() => navigate('/')} style={backButtonStyle}>Back</button>
        </div>
      </form>
    </div>
  );
}

export default AddConcertForm;
