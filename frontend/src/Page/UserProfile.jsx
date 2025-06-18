import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

const ProfileContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
`;

const ProfileCard = styled.div`
  background: white;
  border-radius: 20px;
  box-shadow: 0 15px 30px rgba(0,0,0,0.2);
  width: 100%;
  max-width: 400px;
  padding: 40px 30px;
  text-align: center;
`;

const Avatar = styled.div`
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: #eee;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  color: #764ba2;
`;

const Username = styled.h2`
  margin: 10px 0 5px;
  font-size: 2rem;
  color: #667eea;
`;

const Email = styled.p`
  color: #555;
  margin-bottom: 20px;
`;

function UserProfile({ username }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/users/${username}`)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, [username]);

  if (loading) return <ProfileContainer><ProfileCard>Loading...</ProfileCard></ProfileContainer>;
  if (!user) return <ProfileContainer><ProfileCard>User not found.</ProfileCard></ProfileContainer>;

  // Parse social links if present
  let social = {};
  try {
    social = user.socialLinks ? JSON.parse(user.socialLinks) : {};
  } catch (e) { social = {}; }

  return (
    <ProfileContainer>
      <ProfileCard>
        {user.coverUrl && (
          <img src={user.coverUrl} alt="Cover" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: '16px 16px 0 0', marginBottom: 16 }} />
        )}
        {user.avatarUrl ? (
          <img src={user.avatarUrl} alt="Avatar" style={{ width: 100, height: 100, borderRadius: '50%', objectFit: 'cover', margin: '0 auto 20px' }} />
        ) : (
          <Avatar>{user.username.charAt(0).toUpperCase()}</Avatar>
        )}
        <Username>{user.username}</Username>
        <Email>{user.email}</Email>
        {user.bio && <p style={{ color: '#666', marginBottom: 12 }}>{user.bio}</p>}
        {user.phone && <p><b>Phone:</b> {user.phone}</p>}
        {user.address && <p><b>Address:</b> {user.address}</p>}
        {Object.keys(social).length > 0 && (
          <div style={{ marginTop: 12 }}>
            <b>Social Links:</b>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {Object.entries(social).map(([key, value]) => (
                <li key={key}><a href={value} target="_blank" rel="noopener noreferrer">{key}</a></li>
              ))}
            </ul>
          </div>
        )}
      </ProfileCard>
    </ProfileContainer>
  );
}

export default UserProfile; 