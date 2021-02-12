const slide = document.querySelector('.slide-container');
const slides = Array.from(document.querySelectorAll('.slide'));

let isDragging = false;
let startPos = 0,
  currentTranslate = 0,
  prevTranslate = 0,
  animationID = 0,
  currentIndex = 0;

slides.forEach((slide, index) => {
  const slideImage = slide.querySelector('img');
  slideImage.addEventListener('dragstart', (e) => e.preventDefault());

  slide.addEventListener('touchstart', touchStart(index));
  slide.addEventListener('touchend', touchEnd);
  slide.addEventListener('touchmove', touchMove);

  slide.addEventListener('mousedown', touchStart(index));
  slide.addEventListener('mouseup', touchEnd);
  slide.addEventListener('mouseleave', touchEnd);
  slide.addEventListener('mousemove', touchMove);
});

window.oncontextmenu = function(event) {
  event.preventDefault();
  event.stopPropagation();
  return false;
}

function getPositionX(event) {
  return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
}

function touchStart(index) {
  return function(event) {
    currentIndex = index;
    startPos = getPositionX(event);
    console.log(startPos);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    slide.classList.add('grabbing');
  }
}

function touchEnd(e) {
  isDragging = false;
  cancelAnimationFrame(animationID);

  const movedBy = currentTranslate - prevTranslate;
  console.log('movedBy', movedBy);
  if(movedBy < -100 && currentIndex < slides.length -1) { 
    currentIndex += 1;
    console.log('currentIndex', currentIndex);
  }
  if(movedBy > 100 && currentIndex > 0) { 
    currentIndex -= 1;
    console.log('currentIndex', currentIndex);
  }

  setPositionByIndex();

  slide.classList.remove('grabbing');
}

function touchMove(event) {
  if(isDragging) {
    const currentPosition = getPositionX(event);
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
}

function animation() {
  setSlidePosition();
  if(isDragging) requestAnimationFrame(animation);
}

function setSlidePosition() {
  console.log('`translateX(${currentTranslate}px)`', `translateX(${currentTranslate}px)`);
  slide.style.transform = `translateX(${currentTranslate}px)`
}

function setPositionByIndex() {
  console.log('prevTranslate', prevTranslate);
  console.log('window.innerWidth', window.innerWidth, 'currentIndex', currentIndex, 'currentTranslate', currentTranslate);
  currentTranslate = currentIndex * -window.innerWidth;
  prevTranslate = currentTranslate;
  setSlidePosition();
}