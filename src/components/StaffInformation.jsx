import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function StaffInformation() {
    const { personId } = useParams();
    const [staff, setStaff] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchStaff() {
            try {
                setLoading(true);
                const res = await fetch(`http://localhost:3000/api/people/${personId}`);
                const json = await res.json();
                setStaff(json?.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        }

        fetchStaff();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <img src={staff?.images?.jpg?.image_url} alt={staff?.name} />
            <p>{staff?.name}</p>
            <p>{staff?.url}</p>
        </div>
    );
}