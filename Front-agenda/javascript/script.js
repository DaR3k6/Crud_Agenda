const singInBtnLink = document.querySelector(".singInBtnLink");
const singUpBtnLink = document.querySelector(".singUpBtnLink");
const wrapper = document.querySelector(".wrapper");

singUpBtnLink.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});
singInBtnLink.addEventListener("click", () => {
  wrapper.classList.toggle("active");
});
