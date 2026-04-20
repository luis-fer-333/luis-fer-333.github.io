---
title: "Contact"
date: 2024-01-01
draft: false
hidemeta: true
ShowBreadCrumbs: false
ShowReadingTime: false
ShowPostNavLinks: false
---

Have a question or want to connect? Fill out the form and I'll get back to you.

<form id="contact-form" class="contact-form">
  <input type="text" id="cf-name" placeholder="Your name" required>
  <input type="email" id="cf-email" placeholder="Your email" required>
  <textarea id="cf-message" placeholder="Your message" rows="5" required></textarea>
  <button type="submit">Send message</button>
</form>
<p id="cf-status" style="display:none; margin-top:1rem;"></p>

<script>
document.getElementById('contact-form').addEventListener('submit', function(e) {
  e.preventDefault();
  var name = document.getElementById('cf-name').value;
  var email = document.getElementById('cf-email').value;
  var msg = document.getElementById('cf-message').value;
  var subject = encodeURIComponent('Portfolio contact from ' + name);
  var body = encodeURIComponent('From: ' + name + ' (' + email + ')\n\n' + msg);
  window.location.href = 'mailto:luisfernando064@gmail.com?subject=' + subject + '&body=' + body;
  var st = document.getElementById('cf-status');
  st.textContent = '✅ Your email client should open now. If it didn\'t, email me directly at luisfernando064@gmail.com';
  st.style.display = 'block';
});
</script>

Or reach me directly at [luisfernando064@gmail.com](mailto:luisfernando064@gmail.com) · [LinkedIn](https://linkedin.com/in/lun3429)
