document.addEventListener("DOMContentLoaded", () => {
    const patientBtn = document.getElementById("patientBtn");
    const doctorBtn = document.getElementById("doctorBtn");
    const patientForm = document.getElementById("patientForm");
    const doctorForm = document.getElementById("doctorForm");
    const messageDiv = document.getElementById("message");

    const sendDoctorOtpBtn = document.getElementById("sendDoctorOtpBtn");
    const doctorOtpSection = document.getElementById("doctorOtpSection");
    const doctorOtpMessage = document.getElementById("doctorOtpMessage");

    patientBtn.onclick = () => {
        patientForm.style.display = "block";
        doctorForm.style.display = "none";
        patientBtn.classList.add("active");
        doctorBtn.classList.remove("active");
    };
    doctorBtn.onclick = () => {
        doctorForm.style.display = "block";
        patientForm.style.display = "none";
        doctorBtn.classList.add("active");
        patientBtn.classList.remove("active");
    };

    patientForm.onsubmit = async (e) => {
        e.preventDefault();
        const secretKey = document.getElementById("secretKey").value;

        const res = await fetch("/auth/patient-login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ secretKey })
        });
        const data = await res.json();

        messageDiv.textContent = data.message;
        messageDiv.className = "notification " + (res.ok ? "success" : "error");
        if (res.ok) setTimeout(() => window.location.href = "/home", 1000);
    };

    sendDoctorOtpBtn.onclick = async () => {
        doctorOtpMessage.textContent = "";
        const res = await fetch("/auth/send-otp", { method: "POST" });
        const data = await res.json();

        doctorOtpMessage.textContent = data.message;
        doctorOtpMessage.className = "notification " + (res.ok ? "success" : "error");
        if (res.ok) doctorOtpSection.style.display = "flex";
    };

    document.getElementById("verifyDoctorOtpBtn").onclick = async () => {
        const otp = document.getElementById("doctorOtp").value;
        if (!otp) {
            doctorOtpMessage.textContent = "Enter OTP";
            doctorOtpMessage.className = "notification error";
            return;
        }

        const res = await fetch("/auth/verify-otp", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ otp })
        });
        const data = await res.json();

        doctorOtpMessage.textContent = data.message;
        doctorOtpMessage.className = "notification " + (res.ok ? "success" : "error");
        if (res.ok) setTimeout(() => window.location.href = "/home", 1000);
    };
});
