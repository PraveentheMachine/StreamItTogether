const hamburger = document.querySelector('.navigation__hamburger');
const navlinks = document.querySelector(".navigation__links");
const links = document.querySelectorAll(".navigation__links li");



hamburger.addEventListener("click", () => {
 console.log("HIT");
  navlinks.classList.toggle("open");
  links.forEach(link=>{
   link.classList.toggle("fade");
  })
});

const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
	container.classList.add("right-panel-active");
});

signInButton.addEventListener('click', () => {
	container.classList.remove("right-panel-active");
});
