// import React, { useState } from "react";
// import axios from "axios";

// const Signup = () => {
//     const [formData, setFormData] = useState({
//         name: "",
//         email: "",
//         password: "",
//     });

//     const handleChange = (e) => {
//         setFormData({ ...formData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const res = await axios.post("http://localhost:5000/api/auth/register", formData);
//             alert(res.data.message); // Show success message
//             navigate("/Auth");
//         } catch (error) {
//             alert(error.response.data.error || "Signup failed");
//         }
//     };

//     return (
//         <div>
//             <h2>Signup</h2>
//             <form onSubmit={handleSubmit}>
//                 <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
//                 <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
//                 <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
//                 <button type="submit">Register</button>
//             </form>
//         </div>
//     );
// };

// export default Signup;



import React, { useState } from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import useNavigate
import axios from "axios";

const Signup = () => {
    const navigate = useNavigate(); // ✅ Initialize navigate

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/register", formData);
            alert(res.data.message || "Signup successful!"); // ✅ Show success message
            navigate("/signin"); // ✅ Redirect to Auth page
        } catch (error) {
            alert(error.response?.data?.error || "Signup failed!"); // ✅ Better error handling
            console.error("Signup Error:", error.response?.data || error.message);
        }
    };

    return (
        <div>
            <h2>Signup</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
                <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
                <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
                <button type="submit">Register</button>
            </form>
        </div>
    );
};

export default Signup;
