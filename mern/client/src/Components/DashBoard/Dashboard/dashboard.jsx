import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NavigateSidebar from '../Sidebar/NavigateSidebar';
import RequestListing from '../Donations/RequestListing';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getDatabase, ref, onValue } from 'firebase/database';
import Footer from '../../Footer/footer';
import GoogleMaps from './GoogleMaps';
import Metrics from './Metrixs';
import '../../css/dashboard.css';

export default function Dashboard() {
    const [user, setUser] = useState('');
    const navigate = useNavigate();
    const [userName, setUserName] = useState(null);
    const [userId, setUserId] = useState(null);
    const [userRole, setUserRole] = useState(null);
    const [selectedLocationLat, setSelectedLocationLat] = useState(null);
    const [selectedLocationLng, setSelectedLocationLng] = useState(null);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate('/login');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUserId(user.uid);
                const db = getDatabase();
                const userRef = ref(db, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    const userData = snapshot.val();
                    if (userData && userData.first_name) {
                        setUserName(capitalizeFirstLetter(userData.first_name));
                        setUserRole(capitalizeFirstLetter(userData.account_type));
                    }
                });
            } else {
                setUserId(null);
                setUserName(null);
            }
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const db = getDatabase();
        const donationRef = ref(db, "donationRequests");

        onValue(donationRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const latestEntry = Object.values(data)[Object.values(data).length - 1]; // Get last entry
                if (latestEntry.location) {
                    setSelectedLocationLat(parseFloat(latestEntry.location.lat) || null);
                    setSelectedLocationLng(parseFloat(latestEntry.location.lng) || null);
                }
            }
        });
    }, []);

    function capitalizeFirstLetter(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    const handleLocationClick = (lat, lng) => {
        setSelectedLocationLat(parseFloat(lat) || null);
        setSelectedLocationLng(parseFloat(lng) || null);
    };

    return (
        <div className="container-fluid m-0 p-0">
            <div className="container-fluid row p-0">
                <NavigateSidebar userName={userName} />
                <div className="col-10">
                    <p className="lead d-none d-sm-block pt-2 text-secondary">
                        <strong>Overview</strong>
                    </p>

                    <Metrics />
                    <hr />

                    <RequestListing dashboardView={true} handleLocationClick={handleLocationClick} />

                    <GoogleMaps selectedLocationLat={selectedLocationLat} selectedLocationLng={selectedLocationLng} />
                </div>
            </div>

            <div className='mt-3'>
                <Footer />
            </div>
        </div>
    );
}
