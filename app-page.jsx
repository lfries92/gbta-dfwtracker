'use client';

import React, { useState, useEffect } from 'react';

export default function ReferralTracker() {
  const [referrals, setReferrals] = useState([]);
  const [referrerName, setReferrerName] = useState('');
  const [newMemberName, setNewMemberName] = useState('');
  const [memberType, setMemberType] = useState('Direct');
  const [loading, setLoading] = useState(true);

  const TARGET_DIRECT_MEMBERS = 30;
  const TARGET_ALLIED_MEMBERS = 50;
  const CAMPAIGN_END = new Date('2026-10-31');
  const CAMPAIGN_START = new Date('2026-08-01');

  useEffect(() => {
    const loadData = async () => {
      try {
        const result = await window.storage.get('gbta-referrals');
        if (result) {
          setReferrals(JSON.parse(result.value));
        }
      } catch (error) {
        console.log('Starting with empty tracker');
      }
      setLoading(false);
    };
    loadData();
  }, []);

  const saveReferrals = async (newReferrals) => {
    try {
      await window.storage.set('gbta-referrals', JSON.stringify(newReferrals));
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleAddReferral = (e) => {
    e.preventDefault();
    if (!referrerName.trim() || !newMemberName.trim()) return;

    const newReferral = {
      id: Date.now(),
      referrerName: referrerName.trim(),
      newMemberName: newMemberName.trim(),
      type: memberType,
      date: new Date().toLocaleDateString(),
      points: memberType === 'Direct' ? 2 : 1,
    };

    const updated = [...referrals, newReferral];
    setReferrals(updated);
    saveReferrals(updated);
    setReferrerName('');
    setNewMemberName('');
    setMemberType('Direct');
  };

  const handleDeleteReferral = (id) => {
    const updated = referrals.filter((r) => r.id !== id);
    setReferrals(updated);
    saveReferrals(updated);
  };

  const directCount = referrals.filter((r) => r.type === 'Direct').length;
  const alliedCount = referrals.filter((r) => r.type === 'Allied').length;
  const totalPoints = referrals.reduce((sum, r) => sum + r.points, 0);

  const leaderboard = Object.entries(
    referrals.reduce((acc, ref) => {
      if (!acc[ref.referrerName]) {
        acc[ref.referrerName] = { points: 0, direct: 0, allied: 0 };
      }
      acc[ref.referrerName].points += ref.points;
      if (ref.type === 'Direct') acc[ref.referrerName].direct += 1;
      else acc[ref.referrerName].allied += 1;
      return acc;
    }, {})
  )
    .map(([name, stats]) => ({ name, ...stats }))
    .sort((a, b) => b.points - a.points);

  const now = new Date();
  const daysRemaining = Math.ceil((CAMPAIGN_END - now) / (1000 * 60 * 60 * 24));
  const directPercent = (directCount / TARGET_DIRECT_MEMBERS) * 100;
  const alliedPercent = (alliedCount / TARGET_ALLIED_MEMBERS) * 100;

  const recentActivity = [...referrals].reverse().slice(0, 5);

  if (loading) {
    return (
      <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #f3f4f6)'}}>
        <div style={{textAlign: 'center'}}>
          <div style={{animation: 'spin 2s linear infinite', marginBottom: '1rem'}}>👥</div>
          <p style={{color: '#4f46e5', fontWeight: 600}}>Loading tracker...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{minHeight: '100vh', background: 'linear-gradient(to bottom right, #f0f9ff, #f3f4f6)', padding: '2rem 1rem'}}>
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        <div style={{marginBottom: '2rem'}}>
          <h1 style={{fontSize: '28px', fontWeight: 500, margin: '0 0 0.5rem', color: '#111827'}}>
            GBTA-DFW Membership Drive
          </h1>
          <p style={{fontSize: '14px', color: '#6b7280', margin: 0}}>
            August 1 – October 31, 2026 • {daysRemaining} days remaining
          </p>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px', marginBottom: '2rem'}}>
          <div style={{background: 'white', borderRadius: '8px', borderLeft: '4px solid #16a34a', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
            <p style={{fontSize: '12px', color: '#6b7280', margin: '0 0 0.5rem'}}>Direct Recruits</p>
            <p style={{fontSize: '24px', fontWeight: 500, margin: '0', color: '#16a34a'}}>{directCount}</p>
            <p style={{fontSize: '11px', color: '#9ca3af', margin: '0.5rem 0 0'}}>Target: {TARGET_DIRECT_MEMBERS} (2 pts)</p>
          </div>

          <div style={{background: 'white', borderRadius: '8px', borderLeft: '4px solid #0284c7', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
            <p style={{fontSize: '12px', color: '#6b7280', margin: '0 0 0.5rem'}}>Allied Recruits</p>
            <p style={{fontSize: '24px', fontWeight: 500, margin: '0', color: '#0284c7'}}>{alliedCount}</p>
            <p style={{fontSize: '11px', color: '#9ca3af', margin: '0.5rem 0 0'}}>Target: {TARGET_ALLIED_MEMBERS} (1 pt)</p>
          </div>

          <div style={{background: 'white', borderRadius: '8px', borderLeft: '4px solid #9333ea', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
            <p style={{fontSize: '12px', color: '#6b7280', margin: '0 0 0.5rem'}}>Total Points</p>
            <p style={{fontSize: '24px', fontWeight: 500, margin: '0', color: '#9333ea'}}>{totalPoints}</p>
            <p style={{fontSize: '11px', color: '#9ca3af', margin: '0.5rem 0 0'}}>Leaderboard Score</p>
          </div>

          <div style={{background: 'white', borderRadius: '8px', borderLeft: '4px solid #b45309', padding: '1rem', boxShadow: '0 1px 2px rgba(0,0,0,0.05)'}}>
            <p style={{fontSize: '12px', color: '#6b7280', margin: '0 0 0.5rem'}}>Prizes</p>
            <p style={{fontSize: '18px', fontWeight: 500, margin: '0', color: '#b45309'}}>$450 Total</p>
            <p style={{fontSize: '11px', color: '#9ca3af', margin: '0.5rem 0 0'}}>$200 • $150 • $100</p>
          </div>
        </div>

        <div style={{background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem', marginBottom: '2rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
          <h2 style={{fontSize: '16px', fontWeight: 500, margin: '0 0 1.5rem', color: '#111827'}}>Campaign Progress</h2>
          
          <div style={{marginBottom: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center'}}>
              <span style={{fontSize: '13px', fontWeight: 500, color: '#111827'}}>Direct Members (Travel Managers)</span>
              <span style={{fontSize: '12px', fontWeight: 500, color: '#16a34a'}}>{directCount} / {TARGET_DIRECT_MEMBERS}</span>
            </div>
            <div style={{width: '100%', height: '12px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden'}}>
              <div style={{height: '100%', background: 'linear-gradient(90deg, #16a34a, #10b981)', width: `${Math.min(directPercent, 100)}%`, transition: 'width 0.3s ease'}} />
            </div>
            <p style={{fontSize: '11px', color: '#6b7280', margin: '0.5rem 0 0'}}>
              {Math.round(directPercent)}% toward target
            </p>
          </div>

          <div>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', alignItems: 'center'}}>
              <span style={{fontSize: '13px', fontWeight: 500, color: '#111827'}}>Allied Members (Vendors)</span>
              <span style={{fontSize: '12px', fontWeight: 500, color: '#0284c7'}}>{alliedCount} / {TARGET_ALLIED_MEMBERS}</span>
            </div>
            <div style={{width: '100%', height: '12px', background: '#f3f4f6', borderRadius: '6px', overflow: 'hidden'}}>
              <div style={{height: '100%', background: 'linear-gradient(90deg, #0284c7, #06b6d4)', width: `${Math.min(alliedPercent, 100)}%`, transition: 'width 0.3s ease'}} />
            </div>
            <p style={{fontSize: '11px', color: '#6b7280', margin: '0.5rem 0 0'}}>
              {Math.round(alliedPercent)}% toward target
            </p>
          </div>
        </div>

        <div style={{display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem', gridAutoFlow: 'dense'}}>
          
          <div style={{background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem', height: 'fit-content', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
            <h2 style={{fontSize: '16px', fontWeight: 500, margin: '0 0 1rem', color: '#111827'}}>Add Referral</h2>
            <form onSubmit={handleAddReferral} style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.4rem', color: '#111827'}}>Your Name</label>
                <input
                  type="text"
                  value={referrerName}
                  onChange={(e) => setReferrerName(e.target.value)}
                  placeholder="Your name"
                  style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box'}}
                />
              </div>

              <div>
                <label style={{display: 'block', fontSize: '13px', fontWeight: 500, marginBottom: '0.4rem', color: '#111827'}}>New Member Name</label>
                <input
                  type="text"
                  value={newMemberName}
                  onChange={(e) => setNewMemberName(e.target.value)}
                  placeholder="New member name"
                  style={{width: '100%', padding: '0.5rem', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '14px', fontFamily: 'inherit', boxSizing: 'border-box'}}
                />
              </div>

              <div>
                <p style={{fontSize: '13px', fontWeight: 500, margin: '0 0 0.6rem', color: '#111827'}}>Member Type</p>
                <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                  <label style={{display: 'flex', alignItems: 'center', padding: '0.6rem', border: memberType === 'Direct' ? '1px solid #16a34a' : '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', background: memberType === 'Direct' ? '#f0fdf4' : 'transparent'}}>
                    <input type="radio" value="Direct" checked={memberType === 'Direct'} onChange={(e) => setMemberType(e.target.value)} style={{cursor: 'pointer'}} />
                    <span style={{marginLeft: '0.6rem', fontSize: '13px'}}><strong>Direct</strong> <span style={{fontSize: '11px', color: '#6b7280'}}>Travel Manager (2 pts)</span></span>
                  </label>
                  <label style={{display: 'flex', alignItems: 'center', padding: '0.6rem', border: memberType === 'Allied' ? '1px solid #0284c7' : '1px solid #d1d5db', borderRadius: '6px', cursor: 'pointer', background: memberType === 'Allied' ? '#f0f9ff' : 'transparent'}}>
                    <input type="radio" value="Allied" checked={memberType === 'Allied'} onChange={(e) => setMemberType(e.target.value)} style={{cursor: 'pointer'}} />
                    <span style={{marginLeft: '0.6rem', fontSize: '13px'}}><strong>Allied</strong> <span style={{fontSize: '11px', color: '#6b7280'}}>Vendor (1 pt)</span></span>
                  </label>
                </div>
              </div>

              <button type="submit" style={{padding: '0.6rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '6px', fontWeight: 500, fontSize: '14px', cursor: 'pointer', marginTop: '0.5rem'}}>
                Record Referral
              </button>
            </form>
          </div>

          <div>
            <div style={{background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
              <div style={{padding: '1rem 1.25rem', borderBottom: '1px solid #e5e7eb', background: '#f9fafb'}}>
                <h2 style={{fontSize: '16px', fontWeight: 500, margin: 0, color: '#111827'}}>🏆 Leaderboard</h2>
              </div>
              {leaderboard.length === 0 ? (
                <div style={{padding: '2rem', textAlign: 'center', color: '#6b7280', fontSize: '14px'}}>
                  No referrals yet. Be the first to recruit!
                </div>
              ) : (
                <table style={{width: '100%', fontSize: '13px', borderCollapse: 'collapse'}}>
                  <thead>
                    <tr style={{background: '#f9fafb', borderBottom: '1px solid #e5e7eb'}}>
                      <th style={{padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: 500, color: '#6b7280'}}>Rank</th>
                      <th style={{padding: '0.75rem 1.25rem', textAlign: 'left', fontWeight: 500, color: '#6b7280'}}>Recruiter</th>
                      <th style={{padding: '0.75rem 1.25rem', textAlign: 'center', fontWeight: 500, color: '#6b7280'}}>Direct</th>
                      <th style={{padding: '0.75rem 1.25rem', textAlign: 'center', fontWeight: 500, color: '#6b7280'}}>Allied</th>
                      <th style={{padding: '0.75rem 1.25rem', textAlign: 'right', fontWeight: 500, color: '#6b7280'}}>Points</th>
                      <th style={{padding: '0.75rem 1.25rem', textAlign: 'center', fontWeight: 500, color: '#6b7280'}}>Prize</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboard.map((entry, idx) => {
                      let bgColor = 'white';
                      let prize = '';
                      if (idx === 0) { bgColor = '#fffbeb'; prize = '🥇 $200'; }
                      else if (idx === 1) { bgColor = '#f9fafb'; prize = '🥈 $150'; }
                      else if (idx === 2) { bgColor = '#fef3c7'; prize = '🥉 $100'; }
                      return (
                        <tr key={entry.name} style={{borderBottom: '1px solid #e5e7eb', background: bgColor}}>
                          <td style={{padding: '0.75rem 1.25rem', fontWeight: 500}}>#{idx + 1}</td>
                          <td style={{padding: '0.75rem 1.25rem', fontWeight: 500}}>{entry.name}</td>
                          <td style={{padding: '0.75rem 1.25rem', textAlign: 'center'}}>
                            <span style={{background: '#dcfce7', color: '#16a34a', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '12px', fontWeight: 500}}>{entry.direct}</span>
                          </td>
                          <td style={{padding: '0.75rem 1.25rem', textAlign: 'center'}}>
                            <span style={{background: '#cffafe', color: '#0284c7', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '12px', fontWeight: 500}}>{entry.allied}</span>
                          </td>
                          <td style={{padding: '0.75rem 1.25rem', textAlign: 'right', fontWeight: 500, color: '#4f46e5'}}>{entry.points}</td>
                          <td style={{padding: '0.75rem 1.25rem', textAlign: 'center', fontWeight: 500}}>{prize}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>

            <div style={{background: 'white', borderRadius: '12px', border: '1px solid #e5e7eb', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)'}}>
              <h2 style={{fontSize: '16px', fontWeight: 500, margin: '0 0 1rem', color: '#111827'}}>✨ Recent Activity</h2>
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
                {recentActivity.length === 0 ? (
                  <p style={{fontSize: '13px', color: '#6b7280', margin: 0}}>No activity yet</p>
                ) : (
                  recentActivity.map((ref) => (
                    <div key={ref.id} style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', background: '#f9fafb', borderRadius: '6px'}}>
                      <div style={{flex: 1}}>
                        <p style={{fontSize: '13px', margin: '0 0 0.3rem', color: '#111827'}}>
                          <strong>{ref.referrerName}</strong> referred <strong>{ref.newMemberName}</strong>
                        </p>
                        <p style={{fontSize: '11px', color: '#6b7280', margin: 0}}>
                          {ref.type === 'Direct' ? '🎯 Direct' : '🤝 Allied'} • {ref.date}
                        </p>
                      </div>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.6rem'}}>
                        <span style={{background: '#e0e7ff', color: '#4f46e5', padding: '0.2rem 0.8rem', borderRadius: '12px', fontSize: '12px', fontWeight: 500}}>
                          +{ref.points}
                        </span>
                        <button onClick={() => handleDeleteReferral(ref.id)} style={{background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', fontSize: '16px', padding: 0, lineHeight: 1}}>
                          ✕
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        <div style={{marginTop: '3rem', textAlign: 'center', fontSize: '12px', color: '#6b7280'}}>
          <p>📊 This tracker updates in real-time and saves automatically</p>
          <p style={{margin: '0.3rem 0 0'}}>Share this link with your team to start tracking referrals!</p>
        </div>
      </div>
    </div>
  );
}
