class Responsive {
    checkSection = (section, deltaY) => {
        if (section.clientHeight > window.innerHeight) {
            let bodyRect = document.body.getBoundingClientRect();
            let sectionRect = section.getBoundingClientRect();
            let windowY = window.pageYOffset;
            let sectionNotInTheBottom = (Math.floor(sectionRect.bottom - bodyRect.top - window.innerHeight) !== windowY) || deltaY < 0;
            let sectionNotInTheTop = (Math.floor(sectionRect.top - bodyRect.top) !== windowY) || deltaY > 0;

            if (sectionNotInTheBottom && sectionNotInTheTop) {
                let targetPos = deltaY < 0 ? sectionRect.top : sectionRect.bottom - window.innerHeight;


                if (sectionRect.top - window.innerHeight < sectionRect.bottom && deltaY > 0) {

                    console.log(sectionRect.bottom)
                    return false;

                    let offset = windowY + window.innerHeight;
                    window.scrollTo({top: offset, behavior: 'smooth'});
                    return false

                } else if (sectionRect.bottom + window.innerHeight > sectionRect.top && deltaY < 0) {

                    let offset = windowY - window.innerHeight;
                    if (sectionRect.top + window.innerHeight > 0 && sectionRect.top + window.innerHeight < window.innerHeight) {
                        let offset = targetPos - bodyRect.top;
                        window.scrollTo({top: offset, behavior: 'smooth'});
                        return false
                    }

                    window.scrollTo({top: offset, behavior: 'smooth'});
                    return false

                } else {

                    let offset = targetPos - bodyRect.top;
                    window.scrollTo({top: offset, behavior: 'smooth'});
                    return false

                }
            }

            return true

        }

        return true
    }


}

class SliderFunctions {

    getSlidesFromSection = (section) => {
        let slides = section.querySelectorAll('.slick-slide');
        let arr = [];
        for (let i = 0; i < slides.length; i++) {
            if (!slides[i].classList.contains('slick-cloned'))
                arr.push(slides[i])
        }
        return arr;
    };

    wheelSlider = (i, sections, sliders, deltaY, scroll) => {
        let current_slider: any;
        for (let j = 0; j < sliders.length; j++) {
            if (sliders[j].section_index === i) {
                current_slider = sliders[j];
            }
        }
        let active_slide = parseInt(sections[i].querySelector('.slick-current').dataset.slickIndex);
        let currentSectionSlider: any;
        currentSectionSlider = $(sections[i].querySelector('.scroll-slider'));

        if (deltaY > 0) {
            if (active_slide < current_slider.count) {
                currentSectionSlider.slick('slickNext')
            } else {
                scroll(sections[i + 1], sections[i], deltaY)
            }
        } else {
            if (active_slide > 0) {
                currentSectionSlider.slick('slickPrev')
            } else {
                scroll(sections[i - 1], sections[i], deltaY)
            }
        }
    }
}


class Fullpage {
    /**
     *Nodes:
     */
    sections: any;
    count_sections: number;
    root: Element;

    /**
     *Animations:
     */
    duration: number;
    lastAnimation: number;
    idlePeriod: number;

    /**
     *Sliders settings:
     */
    sliders = [];

    /**
     * Friend classes:
     */
    SliderFunctions = new SliderFunctions();
    Responsive = new Responsive();

    /**
     * Main constructor:
     */
    constructor(public selector: string) {
        this.root = document.querySelector(this.selector);
        this.sections = this.root.querySelectorAll('.section-scroll');
        this.count_sections = this.sections.length - 1;
        this.duration = 600;
        this.lastAnimation = 0;
        this.idlePeriod = 100;

        window.addEventListener('load', this.setEventListeners)
    }


    /**
     * Function scroll. Takes section to which need make scroll:
     */
    scroll = (element, fromSection, deltaY) => {
        let targetPos = deltaY > 0 ? element.getBoundingClientRect().top : element.getBoundingClientRect().bottom - window.innerHeight;
        let startPos = document.body.getBoundingClientRect().top;
        let offset = targetPos - startPos;
        if (this.Responsive.checkSection(fromSection, deltaY))
            window.scrollTo({top: offset, behavior: 'smooth'})
    };

    smallScroll = () => {
        window.scrollTo({top: 50, behavior: 'smooth'})
    };

    /**
     * Function set event wheel for each section. And check does it contain slider:
     */
    setEventListeners = () => {
        this.sliders = [];
        for (let i = 0; i < this.count_sections + 1; i++) {
            let hasSlider = this.sections[i].querySelector(".scroll-slider");
            this.sections[i].addEventListener('mousewheel', e => this.wheelEvent(e, i, hasSlider));
            hasSlider ? this.setSlidersSettings(i) : 0
        }
    };

    /**
     * Function set slider settings which will be needed when scrolling the slider:
     */
    setSlidersSettings = i => {
        let slides = this.SliderFunctions.getSlidesFromSection(this.sections[i]);
        this.sliders.push({section_index: i, slides: slides, count: slides.length - 1});
    };

    wheelEvent = (e, i, hasSlider) => {
        e.preventDefault();
        if (!this.checkCountEvents()) return;
        if (hasSlider) return this.wheelSlider(e.deltaY, i);

        if (e.deltaY > 0) {
            if (i + 1 <= this.count_sections) {
                this.scroll(this.sections[i + 1], this.sections[i], e.deltaY);
            } else if (this.sections[i].clientHeight > window.innerHeight) {
                this.scroll(this.sections[i], this.sections[i], e.deltaY);
            }
        } else {
            if (i - 1 >= 0) this.scroll(this.sections[i - 1], this.sections[i], e.deltaY);
        }

        this.lastAnimation = new Date().getTime();
    };

    wheelSlider = (deltaY, i) => {
        if (!this.checkCountEvents()) return;
        this.SliderFunctions.wheelSlider(i, this.sections, this.sliders, deltaY, this.scroll);
        this.lastAnimation = new Date().getTime();

    };

    checkCountEvents = () => {
        let timeNow = new Date().getTime();
        if (timeNow - this.lastAnimation < this.idlePeriod + this.duration) {
            return false;
        }
        return true
    }
}


new Fullpage('.root');