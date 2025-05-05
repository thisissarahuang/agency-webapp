import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ConcertList() {
  const buttonStyle = {
    width: '100%',
    padding: '10px 15px',
    marginBottom: '10px',
    border: '1px solid',
    borderRadius: '5px',
    cursor: 'pointer',
  };

  const runButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#add8e6', // light blue
    color: 'black',
  };

  const navigate = useNavigate();

  const [concerts, setConcerts] = useState([]);
  const [editingConcertId, setEditingConcertId] = useState(null);
  const [formData, setFormData] = useState({
    artist: '',
    organizer: '',
    location: '',
    concert_date: '',
    concert_time: '',
    duration_minutes: '',
  });

  const [artists, setArtists] = useState([]);
  const [organizers, setOrganizers] = useState([]);
  const [locations, setLocations] = useState([]);
  const [currentAgentName, setCurrentAgentName] = useState('');
  const [dropdownsReady, setDropdownsReady] = useState(false);
  const [originalConcert, setOriginalConcert] = useState(null);

  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeView, setActiveView] = useState('concert'); // 'concert' or 'artistReport'

  const fetchConcerts = async () => {
    const res = await axios.get('http://localhost:8000/api/concerts/');
    setConcerts(res.data);
    setActiveView('concert');
  };

  const fetchDropdownData = async () => {
    const [a, o, l] = await Promise.all([
      axios.get('http://localhost:8000/api/artists/'),
      axios.get('http://localhost:8000/api/organizers/'),
      axios.get('http://localhost:8000/api/locations/')
    ]);
    setArtists(a.data);
    setOrganizers(o.data);
    setLocations(l.data);
    setDropdownsReady(true);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:8000/api/concerts/${id}/`);
    fetchConcerts();
  };

  const handleEditClick = (concert) => {
    if (!dropdownsReady) return;
    setEditingConcertId(concert.id);
    setOriginalConcert(concert);
    setFormData({
      artist: concert.artist,
      organizer: concert.organizer,
      location: concert.location,
      concert_date: concert.concert_date,
      concert_time: concert.concert_time,
      duration_minutes: concert.duration_minutes || ''
    });


    const artist = artists.find((a) => a.id === concert.artist_id);
    if (artist && artist.agent) {
      setCurrentAgentName(`${artist.agent.agent_first_name} ${artist.agent.agent_last_name}`);
    } else {
      setCurrentAgentName('—');
    }
  };

  const handleCancel = () => {
    setEditingConcertId(null);
    setFormData({ artist: '', organizer: '', location: '', concert_date: '', concert_time: '', duration_minutes: '' });
    setCurrentAgentName('');
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === 'artist') {
      const artist = artists.find((a) => String(a.id) === value);
      if (artist && artist.agent) {
        setCurrentAgentName(`${artist.agent.agent_first_name} ${artist.agent.agent_last_name}`);
      } else {
        setCurrentAgentName('—');
      }
    }
  };

  const handleUpdate = async (id) => {
    const finalData = {
      artist: formData.artist || originalConcert.artist,
      organizer: formData.organizer || originalConcert.organizer,
      location: formData.location || originalConcert.location,
      concert_date: formData.concert_date || originalConcert.concert_date,
      concert_time: formData.concert_time || originalConcert.concert_time,
      duration_minutes: formData.duration_minutes || originalConcert.duration_minutes, // ✅ added
    };
    await axios.put(`http://localhost:8000/api/concerts/${id}/`, finalData);
    setEditingConcertId(null);
    setOriginalConcert(null);
    fetchConcerts();
  };

  const runConcertFilter = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/concert-report/', {
        params: {
          start_date: startDate || null,
          end_date: endDate || null,
          artist_id: null,
          organizer_id: null,
          location_id: null
        }
      });
      setConcerts(Array.isArray(res.data) ? res.data : []);
      setActiveView('concert');
    } catch (err) {
      console.error("Failed to fetch filtered concerts", err);
      setConcerts([]);
    }
  };

  const runOrganizerReport = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/concerts-per-organizer/', {
        params: {
          start_date: startDate || null,
          end_date: endDate || null
        }
      });
      setConcerts(Array.isArray(res.data) ? res.data : []);
      setActiveView('organizerReport');
    } catch (err) {
      console.error("Error fetching organizer report", err);
      setConcerts([]);
    }
  };

  const runArtistReport = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/concerts-per-artist/', {
        params: {
          start_date: startDate || null,
          end_date: endDate || null
        }
      });
      setConcerts(Array.isArray(res.data) ? res.data : []);
      setActiveView('artistReport');
    } catch (err) {
      console.error("Error fetching artist report", err);
      setConcerts([]);
    }
  };

  const runLocationReport = async () => {
    try {
      const res = await axios.get('http://localhost:8000/api/concerts-per-location/', {
        params: {
          start_date: startDate || null,
          end_date: endDate || null
        }
      });
      setConcerts(Array.isArray(res.data) ? res.data : []);
      setActiveView('locationReport');
    } catch (err) {
      console.error("Error fetching location report", err);
      setConcerts([]);
    }
  };

  useEffect(() => {
    fetchConcerts();
    fetchDropdownData();
  }, []);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '50px',
    }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>Concert Report</h1>

      <div
        style={{
          display: 'flex',
          maxWidth: '1200px',
          width: '100%',
          gap: '20px',
          justifyContent: 'center',
        }}
      >
        <br />
        {/* LEFT: Main Table */}
        <div style={{ flex: 5 }}>
          {activeView === 'concert' && (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Artist</th>
                  <th>Agent</th>
                  <th>Organizer</th>
                  <th>Location</th>
                  <th>Time</th>
                  <th>Duration (min)</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {concerts.map((concert) => (
                  <tr key={concert.id}>
                    {editingConcertId === concert.id ? (
                      <>
                        <td>
                          <input
                            type="date"
                            name="concert_date"
                            value={formData.concert_date}
                            onChange={handleFormChange}
                          />
                        </td>
                        <td>
                          <select name="artist" value={String(formData.artist)} onChange={handleFormChange}>
                            <option value="">-- Select --</option>
                            {artists.map((a) => (
                              <option key={a.id} value={String(a.id)}>
                                {a.artist_first_name} {a.artist_last_name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>{currentAgentName}</td>
                        <td>
                          <select name="organizer" value={String(formData.organizer)} onChange={handleFormChange}>
                            <option value="">-- Select --</option>
                            {organizers.map((o) => (
                              <option key={o.id} value={String(o.id)}>
                                {o.organizer_first_name} {o.organizer_last_name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select name="location" value={String(formData.location)} onChange={handleFormChange}>
                            <option value="">-- Select --</option>
                            {locations.map((l) => (
                              <option key={l.id} value={String(l.id)}>
                                {l.city}, {l.country}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="time"
                            name="concert_time"
                            value={formData.concert_time}
                            onChange={handleFormChange}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="duration_minutes"
                            value={formData.duration_minutes}
                            onChange={handleFormChange}
                            min="1"
                            required
                          />
                        </td>
                        <td>
                          <button onClick={() => handleUpdate(concert.id)}>Save</button>
                          <button onClick={handleCancel}>Cancel</button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td>{concert.concert_date}</td>
                        <td>{concert.artist_name}</td>
                        <td>{concert.agent_name}</td>
                        <td>{concert.organizer_name}</td>
                        <td>{concert.location_name}</td>
                        <td>{concert.concert_time}</td>
                        <td>{concert.duration_minutes}</td>
                        <td>
                          <button onClick={() => handleEditClick(concert)} disabled={!dropdownsReady}>Edit</button>
                          <button onClick={() => handleDelete(concert.id)}>Delete</button>
                        </td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'artistReport' && (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Artist</th>
                  <th>Concert Count</th>
                  <th>Avg Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {concerts.map((row, index) => (
                  <tr key={index}>
                    <td>{row.artist_name}</td>
                    <td>{row.concert_count}</td>
                    {/* <td>{row.avg_duration_minutes}</td> */}
                    <td>{parseFloat(row.avg_duration_minutes).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'organizerReport' && (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Organizer</th>
                  <th>Concert Count</th>
                  <th>Avg Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {concerts.map((row, index) => (
                  <tr key={index}>
                    <td>{row.artist_name}</td>
                    <td>{row.concert_count}</td>
                    <td>{row.avg_duration_minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {activeView === 'locationReport' && (
            <table border="1" cellPadding="8">
              <thead>
                <tr>
                  <th>Location</th>
                  <th>Concert Count</th>
                  <th>Avg Duration (min)</th>
                </tr>
              </thead>
              <tbody>
                {concerts.map((row, index) => (
                  <tr key={index}>
                    <td>{row.artist_name}</td>
                    <td>{row.concert_count}</td>
                    <td>{row.avg_duration_minutes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* RIGHT: Filter Panel */}
        <div style={{ flex: 1, marginLeft: '5px' }}>
          <button
            onClick={() => navigate('/add-concert')}
            style={{
              ...buttonStyle,
              backgroundColor: '#90ee90',
              color: 'black',
            }}
          >
            Add New Concert
          </button>
          <br /><br />
          <button onClick={fetchConcerts} style={buttonStyle}>Reset Filter</button>
          <h3>
            {activeView === 'artistReport'
              ? 'Artist Report Filter'
              : activeView === 'organizerReport'
                ? 'Organizer Report Filter'
                : activeView === 'locationReport'
                  ? 'Location Report Filter'
                  : 'Concert Report Filter'
            }
          </h3>
          <label>Start Date:</label>
          <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
          <br />
          <label>End Date:</label>
          <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
          <br />
          <button style={{...runButtonStyle, marginTop: '10px'}} onClick={runConcertFilter}>Run Concert Filter</button>
          <br />
          <button style={{...runButtonStyle, marginTop: '10px'}} onClick={runArtistReport}>Run Artist Report</button>
          <br />
          <button style={{...runButtonStyle, marginTop: '10px'}} onClick={runOrganizerReport}>Run Organizer Report</button>
          <br />
          <button style={{...runButtonStyle, marginTop: '10px'}} onClick={runLocationReport}>Run Location Report</button>
        </div>
      </div>
    </div>
  );
}

export default ConcertList;

