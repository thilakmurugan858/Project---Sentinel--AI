"""
Tamil Nadu 38 Districts & Towns Geographic Directory
Includes representative taluks, major agricultural towns, and coordinate centroids.
Complies with Master Build Spec Section 2.
"""

from typing import Dict, Any, List

TAMIL_NADU_DISTRICTS: Dict[str, Dict[str, Any]] = {
    "Ariyalur": {
        "lat": 11.1401, "lon": 79.0786, "is_validated": False,
        "towns": ["Ariyalur", "Jayankondam", "Sendurai", "Udayarpalayam", "Andimadam"]
    },
    "Chengalpattu": {
        "lat": 12.6922, "lon": 79.9768, "is_validated": False,
        "towns": ["Chengalpattu", "Maduranthakam", "Tambaram", "Tirukalukundram", "Cheyyur"]
    },
    "Chennai": {
        "lat": 13.0827, "lon": 80.2707, "is_validated": False,
        "towns": ["Chennai Central", "Mylapore", "T Nagar", "Velachery", "Ambattur"]
    },
    "Coimbatore": {
        "lat": 11.0168, "lon": 76.9558, "is_validated": False,
        "towns": ["Coimbatore", "Pollachi", "Mettupalayam", "Sulur", "Valparai"]
    },
    "Cuddalore": {
        "lat": 11.7480, "lon": 79.7714, "is_validated": False,
        "towns": ["Cuddalore", "Chidambaram", "Panruti", "Virudhachalam", "Kattumannarkoil"]
    },
    "Dharmapuri": {
        "lat": 12.1211, "lon": 78.1582, "is_validated": False,
        "towns": ["Dharmapuri", "Harur", "Palacode", "Pennagaram", "Pappireddipatti"]
    },
    "Dindigul": {
        "lat": 10.3673, "lon": 77.9803, "is_validated": False,
        "towns": ["Dindigul", "Palani", "Oddanchatram", "Kodaikanal", "Natham"]
    },
    "Erode": {
        "lat": 11.3410, "lon": 77.7172, "is_validated": False,
        "towns": ["Erode", "Gobichettipalayam", "Bhavani", "Perundurai", "Sathyamangalam"]
    },
    "Kallakurichi": {
        "lat": 11.7383, "lon": 78.9639, "is_validated": False,
        "towns": ["Kallakurichi", "Sankarapuram", "Ulundurpet", "Chinnasalem", "Tirukkoyilur"]
    },
    "Kanchipuram": {
        "lat": 12.8342, "lon": 79.7036, "is_validated": False,
        "towns": ["Kanchipuram", "Sriperumbudur", "Uthiramerur", "Walajabad", "Kundrathur"]
    },
    "Kanyakumari": {
        "lat": 8.0883, "lon": 77.5385, "is_validated": False,
        "towns": ["Nagercoil", "Kanyakumari", "Padmanabhapuram", "Thuckalay", "Kuzhithurai"]
    },
    "Karur": {
        "lat": 10.9601, "lon": 78.0766, "is_validated": False,
        "towns": ["Karur", "Kulithalai", "Aravakurichi", "Krishnarayapuram", "Pugalur"]
    },
    "Krishnagiri": {
        "lat": 12.5186, "lon": 78.2137, "is_validated": False,
        "towns": ["Krishnagiri", "Hosur", "Pochampalli", "Uthangarai", "Denkanikottai"]
    },
    "Madurai": {
        "lat": 9.9252, "lon": 78.1198, "is_validated": False,
        "towns": ["Madurai North", "Madurai South", "Melur", "Usilampatti", "Vadipatti", "Thirumangalam"]
    },
    "Mayiladuthurai": {
        "lat": 11.1035, "lon": 79.6547, "is_validated": False,
        "towns": ["Mayiladuthurai", "Sirkazhi", "Tharangambadi", "Kuthalam"]
    },
    "Nagapattinam": {
        "lat": 10.7672, "lon": 79.8449, "is_validated": False,
        "towns": ["Nagapattinam", "Kilvelur", "Vedaranyam", "Thirukkuvalai"]
    },
    "Namakkal": {
        "lat": 11.2189, "lon": 78.1674, "is_validated": False,
        "towns": ["Namakkal", "Tiruchengode", "Rasipuram", "Paramathi Velur", "Kolli Hills"]
    },
    "Nilgiris": {
        "lat": 11.4102, "lon": 76.6950, "is_validated": False,
        "towns": ["Udhagamandalam (Ooty)", "Coonoor", "Kotagiri", "Gudalur", "Pandalur"]
    },
    "Perambalur": {
        "lat": 11.2342, "lon": 78.8809, "is_validated": False,
        "towns": ["Perambalur", "Kunnam", "Veppanthattai", "Alathur"]
    },
    "Pudukkottai": {
        "lat": 10.3797, "lon": 78.8208, "is_validated": False,
        "towns": ["Pudukkottai", "Aranthangi", "Alangudi", "Gandarvakottai", "Iluppur"]
    },
    "Ramanathapuram": {
        "lat": 9.3639, "lon": 78.8395, "is_validated": False,
        "towns": ["Ramanathapuram", "Paramakudi", "Rameswaram", "Tiruvadanai", "Kamuthi"]
    },
    "Ranipet": {
        "lat": 12.9272, "lon": 79.3330, "is_validated": False,
        "towns": ["Ranipet", "Walajah", "Arcot", "Arakkonam", "Nemili"]
    },
    "Salem": {
        "lat": 11.6643, "lon": 78.1460, "is_validated": False,
        "towns": ["Salem", "Attur", "Mettur", "Omalur", "Edappadi", "Sankari"]
    },
    "Sivaganga": {
        "lat": 9.8433, "lon": 78.4809, "is_validated": False,
        "towns": ["Sivaganga", "Karaikudi", "Devakottai", "Manamadurai", "Tiruppuvanam"]
    },
    "Tenkasi": {
        "lat": 8.9594, "lon": 77.3150, "is_validated": False,
        "towns": ["Tenkasi", "Sankarankovil", "Ambasamudram", "Kadayanallur", "Shenkottai"]
    },
    "Thanjavur": {
        "lat": 10.7870, "lon": 79.1378, "is_validated": True,
        "validation_note": "Primary field-validated district. Ground truth field trials conducted in Thennamanadu South & Orathanadu.",
        "towns": ["Thanjavur", "Orathanadu", "Kumbakonam", "Papanasam", "Pattukkottai", "Thiruvaiyaru", "Budalur", "Peravurani"]
    },
    "Theni": {
        "lat": 10.0104, "lon": 77.4768, "is_validated": False,
        "towns": ["Theni", "Periyakulam", "Bodinayakanur", "Uthamapalayam", "Andipatti"]
    },
    "Thoothukudi": {
        "lat": 8.7642, "lon": 78.1348, "is_validated": False,
        "towns": ["Thoothukudi", "Kovilpatti", "Tiruchendur", "Srivaikuntam", "Ottapidaram"]
    },
    "Tiruchirappalli": {
        "lat": 10.7905, "lon": 78.7047, "is_validated": False,
        "towns": ["Tiruchirappalli", "Srirangam", "Lalgudi", "Manapparai", "Musiri", "Thuraiyur"]
    },
    "Tirunelveli": {
        "lat": 8.7139, "lon": 77.7567, "is_validated": False,
        "towns": ["Tirunelveli", "Palayamkottai", "Nanguneri", "Radhapuram", "Cheranmahadevi"]
    },
    "Tirupathur": {
        "lat": 12.4960, "lon": 78.5678, "is_validated": False,
        "towns": ["Tirupathur", "Vaniyambadi", "Ambur", "Natrampalli"]
    },
    "Tiruppur": {
        "lat": 11.1085, "lon": 77.3411, "is_validated": False,
        "towns": ["Tiruppur", "Dharapuram", "Kangeyam", "Udumalaipettai", "Avinashi", "Madathukulam"]
    },
    "Tiruvallur": {
        "lat": 13.1432, "lon": 79.9079, "is_validated": False,
        "towns": ["Tiruvallur", "Avadi", "Ponneri", "Gummidipoondi", "Tiruttani", "Uthukottai"]
    },
    "Tiruvannamalai": {
        "lat": 12.2253, "lon": 79.0747, "is_validated": False,
        "towns": ["Tiruvannamalai", "Arani", "Cheyyar", "Polur", "Chengam", "Vandavasi"]
    },
    "Tiruvarur": {
        "lat": 10.7725, "lon": 79.6365, "is_validated": False,
        "towns": ["Tiruvarur", "Mannargudi", "Thiruthuraipoondi", "Needamangalam", "Nannilam", "Valangaiman"]
    },
    "Vellore": {
        "lat": 12.9165, "lon": 79.1325, "is_validated": False,
        "towns": ["Vellore", "Katpadi", "Gudiyatham", "Anaicut", "Kaniyambadi"]
    },
    "Viluppuram": {
        "lat": 11.9401, "lon": 79.4861, "is_validated": False,
        "towns": ["Viluppuram", "Tindivanam", "Gingee", "Vanur", "Vikravandi", "Kandachipuram"]
    },
    "Virudhunagar": {
        "lat": 9.5680, "lon": 77.9624, "is_validated": False,
        "towns": ["Virudhunagar", "Sivakasi", "Srivilliputhur", "Rajapalayam", "Aruppukkottai", "Sattur"]
    }
}
