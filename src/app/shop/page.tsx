'use client';

import { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import Image from 'next/image';
import AudioPlayer from '../../components/AudioPlayer';
import PremiumAudioPlayer from '../../components/PremiumAudioPlayer';
import PaymentComponent from '../../components/PaymentComponent';
import { useAuth } from '../../contexts/AuthContext';
import { isPurchased, recordPurchase, PurchaseType } from '../../lib/purchaseTracker';

const blindBatteredTracks = [
	{ id: '01', title: 'Gotta Split', src: '/audio/Blind and Battered [Explicit]/01 - Gotta Split [Explicit].mp3', duration: '3:12' },
	{ id: '02', title: 'I Think', src: '/audio/Blind and Battered [Explicit]/02 - I Think [Explicit].mp3', duration: '2:58' },
	{ id: '03', title: 'Keep Your Mouth Shut (Skit)', src: '/audio/Blind and Battered [Explicit]/03 - Keep Your Mouth Shut (Skit) [Explicit].mp3', duration: '0:45' },
	{ id: '04', title: 'Just a Player', src: '/audio/Blind and Battered [Explicit]/04 - Just a Player [Explicit].mp3', duration: '3:22' },
	{ id: '05', title: 'Ziplocks', src: '/audio/Blind and Battered [Explicit]/05 - Ziplocks [Explicit].mp3', duration: '4:10' },
	{ id: '06', title: 'Where You Been (Skit)', src: '/audio/Blind and Battered [Explicit]/06 - Where You Been (Skit) [Explicit].mp3', duration: '1:15' },
	{ id: '07', title: 'Cant Tell Me', src: '/audio/Blind and Battered [Explicit]/07 - Cant Tell Me [Explicit].mp3', duration: '3:55' },
	{ id: '08', title: 'Just a Gimmick', src: '/audio/Blind and Battered [Explicit]/08 - Just a Gimmick [Explicit].mp3', duration: '4:02' },
	{ id: '09', title: 'Wish I Knew Then', src: '/audio/Blind and Battered [Explicit]/09 - Wish I Knew Then [Explicit].mp3', duration: '3:50' },
	{ id: '10', title: 'Blind and Battered', src: '/audio/Blind and Battered [Explicit]/10 - Blind and Battered [Explicit].mp3', duration: '3:40' },
	{ id: '11', title: 'Smoother Than Woodgrain', src: '/audio/Blind and Battered [Explicit]/11 - Smoother Than Woodgrain [Explicit].mp3', duration: '3:15' },
	{ id: '12', title: 'Touch You', src: '/audio/Blind and Battered [Explicit]/12 - Touch You [Explicit].mp3', duration: '3:25' },
	{ id: '13', title: 'Life of Magic', src: '/audio/Blind and Battered [Explicit]/13 - Life of Magic [Explicit].mp3', duration: '3:35' },
	{ id: '14', title: 'Its Going Down', src: '/audio/Blind and Battered [Explicit]/14 - Its Going Down [Explicit].mp3', duration: '3:45' },
	{ id: '15', title: 'One Way In', src: '/audio/Blind and Battered [Explicit]/15 - One Way In [Explicit].mp3', duration: '3:50' },
	{ id: '16', title: 'Crispy Game', src: '/audio/Blind and Battered [Explicit]/16 - Crispy Game [Explicit].mp3', duration: '4:05' },
	{ id: '17', title: 'The End of the World', src: '/audio/Blind and Battered [Explicit]/17 - The End of the World [Explicit].mp3', duration: '3:30' },
	{ id: '18', title: 'Smell of Victory', src: '/audio/Blind and Battered [Explicit]/18 - Smell of Victory [Explicit].mp3', duration: '3:55' },
	{ id: '19', title: 'Do the I\'m the Shit', src: '/audio/Blind and Battered [Explicit]/19 - Do the I\'m the Shit [Explicit].mp3', duration: '4:00' },
	{ id: '20', title: 'Hatin On a Blind Man', src: '/audio/Blind and Battered [Explicit]/20 - Hatin On a Blind Man [Explicit].mp3', duration: '3:44' },
];

// Helper: get sample src for a track
function getSampleSrc(track: { id: string }) {
	return `/audio/Blind and Battered [Explicit]/samples/${track.id}-sample.mp3`;
}

export default function ShopPage() {
	const [unlocked, setUnlocked] = useState(false);
	const [trackIndex, setTrackIndex] = useState(0);
	const [unlockedTracks, setUnlockedTracks] = useState<string[]>([]); // array of track ids
	const { isAuthenticated, user } = useAuth();

	// Check if user has purchases
	useEffect(() => {
		if (isAuthenticated && user?.id) {
			// Check if user has purchased the album
			const hasAlbum = isPurchased(user.id, PurchaseType.ALBUM, 'blind-battered');
			if (hasAlbum) {
				setUnlocked(true);
			}

			// Check individual track purchases
			const userPurchasedTracks = blindBatteredTracks
				.filter(track => isPurchased(user.id, PurchaseType.TRACK, track.id))
				.map(track => track.id);
			
			if (userPurchasedTracks.length > 0) {
				setUnlockedTracks(userPurchasedTracks);
			}
		}
	}, [isAuthenticated, user]);

	const handleAlbumStreamPurchase = (paymentId: string) => {
		if (isAuthenticated && user?.id) {
			recordPurchase(
				user.id,
				PurchaseType.ALBUM,
				'blind-battered',
				1,
				paymentId
			);
			setUnlocked(true);
		} else {
			alert('Please log in to purchase');
		}
	};

	const handleTrackPurchase = (id: string, paymentId: string) => {
		if (isAuthenticated && user?.id) {
			recordPurchase(
				user.id,
				PurchaseType.TRACK,
				id,
				3,
				paymentId
			);
			setUnlockedTracks((prev) => [...prev, id]);
		} else {
			alert('Please log in to purchase');
		}
	};

	const currentTrack = blindBatteredTracks[trackIndex];
	const isTrackUnlocked = unlocked || unlockedTracks.includes(currentTrack.id);

	const goToPrev = () => setTrackIndex((i) => (i - 1 + blindBatteredTracks.length) % blindBatteredTracks.length);
	const goToNext = () => setTrackIndex((i) => (i + 1) % blindBatteredTracks.length);
	return (
		<div className="bg-gray-900 text-white min-h-screen flex items-center justify-center">
			<div className="w-full max-w-4xl mx-auto px-4 py-8">				<div className="flex flex-col items-center justify-center space-y-8">					{/* --- Logo at the top, centered --- */}
					<div className="hero-logo-container w-full text-center mb-6">
						<Image 
							src="/Images/macwayne-logo.png" 
							alt="Mac Wayne" 
							width={2400}
							height={600}
							className="hero-logo mx-auto"
							priority
							sizes="100vw"
							style={{
								maxWidth: '100%',
								height: 'auto',
								backgroundColor: 'transparent',
							}}
						/>
					</div>

					<h1 className="bebas-header text-6xl text-center text-white mb-4">Blind & Battered [Explicit]</h1>
					<p className="text-center text-gray-400 text-lg mb-8 max-w-2xl">
						Stream the full album for $1. Buy any song for $3 (instant MP3 download), or get the full album for $15 (all downloads, high-res MP3s included).
					</p>

					{/* Album Purchase Section */}
					<div className="text-center mb-8">
						{unlocked ? (
							<div className="text-green-400 font-bold text-xl mb-4">✓ Full album streaming unlocked!</div>
						) : (							<PaymentComponent
								amount={1}
								description="Stream the full Blind & Battered album"
								onSuccess={handleAlbumStreamPurchase}
							/>
						)}
					</div>					{/* Full Album Player */}
					{unlocked ? (
						<div className="w-full max-w-2xl mb-8">
							<AudioPlayer
								src={blindBatteredTracks[0].src}
								title="Blind & Battered [Explicit] (Full Album)"
								artist="Mac Wayne"
								className="w-full"
							/>
						</div>
					) : (
						<div className="w-full max-w-2xl mb-8">							<PremiumAudioPlayer
								src={blindBatteredTracks[0].src}
								title="Blind & Battered [Explicit] (Full Album)"
								artist="Mac Wayne"
								className="w-full"
								trackPrice={9.99}
								albumId="blind-battered"
								contentType={PurchaseType.ALBUM}
							/>
						</div>
					)}

					{/* --- Track Carousel --- */}
					<div className="w-full max-w-2xl">
						<div className="bg-gray-800/90 rounded-xl shadow-2xl p-8 transition-all duration-500">
							<div className="text-center mb-6">
								<h2 className="text-2xl font-bold text-white mb-2">Individual Tracks</h2>
								<p className="text-gray-400">Navigate through all 20 tracks</p>
							</div>

							<div className="flex flex-col items-center space-y-6">								{/* Track Cover */}
								<Image
									src="/Images/macwayne-background.png"
									alt="Track Cover"
									width={150}
									height={150}
									className="rounded-lg shadow-lg"
									style={{ width: 150, height: 150, objectFit: 'cover', border: '3px solid #f97316' }}
								/>

								{/* Track Info */}
								<div className="text-center">
									<h3 className="font-bold text-2xl text-white mb-2">{currentTrack.title}</h3>
									<p className="text-gray-400 text-sm">Duration: {currentTrack.duration}</p>
								</div>								{/* Audio Player */}
								<div className="w-full" key={trackIndex}>
									{isTrackUnlocked ? (
										<AudioPlayer
											src={currentTrack.src}
											title={currentTrack.title}
											artist="Mac Wayne"
											className="w-full"
										/>
									) : (
										<div className="space-y-4">
											<AudioPlayer
												src={currentTrack.src}
												title={currentTrack.title}
												artist="Mac Wayne"
												className="w-full"
												previewMode={true}
												previewDuration={30}
											/>
													<div className="flex justify-center">
												{unlockedTracks.includes(currentTrack.id) ? (
													<span className="text-green-500">Track Purchased</span>
												) : (
													<AudioPlayer
														src={getSampleSrc(currentTrack)}
														title={`${currentTrack.title} (30-sec Sample)`}
														artist="Mac Wayne"
														className="w-full"
													/>
												)}
											</div>
											<div className="bg-orange-500/20 border border-orange-500 rounded-lg p-3 text-center">
												<div className="flex items-center justify-center gap-2 text-orange-400 text-sm">
													<span>🔒</span>
													<span>Sample only - Purchase to unlock full track</span>
												</div>
											</div>
										</div>
									)}
								</div>

								{/* Navigation Controls */}
								<div className="flex items-center gap-4 w-full justify-center">
									<button 
										onClick={goToPrev} 
										className="bg-gray-700 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
									>
										← Previous
									</button>
									
									<div className="text-center px-4">
										<div className="text-white font-bold">{trackIndex + 1} / {blindBatteredTracks.length}</div>
									</div>
									
									<button 
										onClick={goToNext} 
										className="bg-gray-700 hover:bg-orange-500 text-white px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105"
									>
										Next →
									</button>
								</div>

								{/* Purchase Button */}
								<div className="w-full text-center">
									{isTrackUnlocked ? (
										<a											href={currentTrack.src}
											download
											className="inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-colors"
										>
											<Download size={16} />
											Download (Already Purchased)
										</a>
									) : (										<PaymentComponent
											amount={3}
											description={`Buy & Download: ${currentTrack.title}`}
											onSuccess={(paymentId) => handleTrackPurchase(currentTrack.id, paymentId)}
										/>
									)}
								</div>

								{/* Progress Bar */}
								<div className="w-full">
									<div className="h-2 bg-gray-700 rounded-full overflow-hidden mb-2">
										<div
											className="bg-orange-500 h-2 rounded-full transition-all duration-500"
											style={{ width: `${((trackIndex + 1) / blindBatteredTracks.length) * 100}%` }}
										/>
									</div>
									<div className="text-sm text-gray-400 text-center">
										Progress: {trackIndex + 1} of {blindBatteredTracks.length} tracks
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Full Album Purchase */}
					<div className="text-center">
						<div className="bg-gradient-to-r from-orange-500/20 to-red-500/20 border border-orange-500 rounded-xl p-6">
							<h3 className="text-xl font-bold text-white mb-2">Get the Complete Experience</h3>
							<p className="text-gray-300 mb-4">Download all 20 tracks in high-resolution MP3 format</p>							<PaymentComponent
								amount={15}
								description="Buy & Download Full Album (High-Res MP3s)"
								onSuccess={(paymentId) => {
									if (isAuthenticated && user?.id) {
										recordPurchase(
											user.id,
											PurchaseType.ALBUM,
											'blind-battered-download',
											15,
											paymentId
										);
										setUnlocked(true);
									}
								}}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
