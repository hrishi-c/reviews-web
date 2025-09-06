const stars = document.querySelectorAll('.star');
const ratingInput = document.getElementById('rating');
const form = document.getElementById('feedbackForm');
const toastContainer = document.getElementById('toastContainer');

let currentRating = 0;

stars.forEach(star => {
    star.addEventListener('click', () => {
        const rating = parseInt(star.dataset.rating);
        currentRating = rating;
        ratingInput.value = rating;

        stars.forEach(s => {
            if (parseInt(s.dataset.rating) <= rating) {
                s.classList.add('selected');
                s.innerHTML = '&#9733;';
            } else {
                s.classList.remove('selected');
                s.innerHTML = '&#9734;';
            }
        });
    });
});

function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <span>${message}</span>
        <span class="close-btn">&#10005;</span>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => { toast.style.right = '20px'; }, 50);

    toast.querySelector('.close-btn').addEventListener('click', () => {
        toastContainer.removeChild(toast);
    });

    setTimeout(() => {
        if (toast.parentNode) toastContainer.removeChild(toast);
    }, 5000);
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        review: document.getElementById('review').value,
        rating: ratingInput.value
    };

    try {
        const res = await fetch('/api/reviews', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });

        const data = await res.json();

        if (res.ok) {
            showToast('Review submitted successfully!', 'success');

            form.reset();
            stars.forEach(s => {
                s.classList.remove('selected');
                s.innerHTML = '&#9734;';
            });
            ratingInput.value = 0;

        } else {
            showToast(data.message || 'Submission failed!', 'error');
        }

    } catch (err) {
        showToast('Something went wrong. Please try again.', 'error');
    }
});
