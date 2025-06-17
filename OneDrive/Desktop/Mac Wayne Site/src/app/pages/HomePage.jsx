import React from 'react';
import '../strange-theme.css';

const HomePage = () => {
  return (
    <div className="strange-theme min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="strange-section text-center py-20">
          <img 
            src="/Images/macwayne-logo.png" 
            alt="Mac Wayne" 
            className="hero-logo mx-auto mb-6"
          />
          <p className="text-xl md:text-2xl mb-8" style={{color: '#333333'}}>OFFICIAL WEBSITE</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <button className="strange-button">STREAM MUSIC</button>
            <button className="strange-button">WATCH VIDEOS</button>
          </div>
        </section>
        
        {/* Latest Release */}
        <section className="strange-section my-12">
          <h2 className="strange-header">LATEST RELEASE</h2>
          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img 
                src="/Images/placeholder-album.jpg" 
                alt="Latest Album" 
                className="w-full max-w-md mx-auto shadow-lg"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://placehold.co/400x400/ff0000/FFF?text=Album+Cover';
                }}
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4" style={{color: '#000000'}}>ALBUM TITLE</h3>
              <p className="mb-6" style={{color: '#333333'}}>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quam velit, vulputate eu pharetra nec, mattis ac neque. Duis vulputate commodo lectus.
              </p>
              <div className="strange-audio-player mb-6">
                <div className="strange-audio-controls">
                  <button style={{color: '#cc0000'}}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                  <div>
                    <div className="text-sm" style={{color: '#666666'}}>Now Playing</div>
                    <div style={{color: '#000000'}}>Track Title</div>
                  </div>
                </div>
                <div className="strange-audio-progress">
                  <div className="strange-audio-progress-bar" style={{width: '30%'}}></div>
                </div>
              </div>
              <button className="strange-button">STREAM FULL ALBUM</button>
            </div>
          </div>
        </section>
        
        {/* Music Showcase */}
        <section className="strange-section my-12">
          <h2 className="strange-header">MUSIC</h2>
          <div className="album-showcase">
            {[1, 2, 3, 4].map((album) => (
              <div className="album-card" key={album}>
                <img 
                  src={`https://placehold.co/400x400/333/FFF?text=Album+${album}`} 
                  alt={`Album ${album}`} 
                  className="album-cover"
                />
                <div className="album-info">
                  <div className="album-title">Album {album}</div>
                  <div className="album-year">2023</div>
                </div>
                <a href="#" className="album-link">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                </a>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="strange-button">VIEW ALL MUSIC</button>
          </div>
        </section>
        
        {/* Upcoming Shows */}
        <section className="strange-section my-12">
          <h2 className="strange-header">UPCOMING SHOWS</h2>
          <div className="tour-dates">
            {[
              { day: '15', month: 'JUN', venue: 'The Underground', city: 'Charlotte, NC' },
              { day: '22', month: 'JUN', venue: 'The Fillmore', city: 'Detroit, MI' },
              { day: '29', month: 'JUN', venue: 'House of Blues', city: 'Chicago, IL' }
            ].map((event, index) => (
              <div className="event-item" key={index}>
                <div className="event-date">
                  <div className="event-day">{event.day}</div>
                  <div className="event-month">{event.month}</div>
                </div>
                <div className="event-info">
                  <h3>{event.venue}</h3>
                  <div className="event-venue">Live Performance</div>
                  <div className="event-city">{event.city}</div>
                </div>
                <button className="ticket-button">Tickets</button>
              </div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="strange-button">VIEW ALL SHOWS</button>
          </div>
        </section>
        
        {/* Newsletter */}
        <section className="strange-section my-12">
          <h2 className="strange-header">JOIN THE FANBASE</h2>
          <div className="newsletter-form">
            <p className="mb-6" style={{color: '#333333'}}>Subscribe to get updates on new music, videos, tour dates, and exclusive content.</p>
            <form className="grid md:grid-cols-3 gap-4">
              <div className="form-group md:col-span-1">
                <input type="text" placeholder="Your Name" className="strange-input" />
              </div>
              <div className="form-group md:col-span-1">
                <input type="email" placeholder="Your Email" className="strange-input" />
              </div>
              <div className="md:col-span-1">
                <button type="submit" className="strange-button w-full">SUBSCRIBE</button>
              </div>
            </form>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
