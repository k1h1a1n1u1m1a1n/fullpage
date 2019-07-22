class Options {

    initOptionsSlider = slider => {
        let arr = [];
        for (let i = 0; i < slider.length; i++) {
            arr.push(document.querySelector(slider[i]));
        }
        return arr
    };

    initOptions = options => {
        console.log(options)
        let globalOptions = null;
        if (options) {
            globalOptions = {};
            if (options.slider) {
                globalOptions = this.initOptionsSlider(options.slider)
            }
        }
        return globalOptions
    }
}

class Sliders {
    getSlidesInSection = (sections, i): Array<object> => {
        let slides = sections[i].querySelectorAll('.slick-slide');
        let arr = [];
        for (let i = 0; i < slides.length; i++) {
            if (!slides[i].classList.contains('slick-cloned'))
                arr.push(slides[i])
        }
        return arr;
    };
}

function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            if (name !== 'constructor') {
                derivedCtor.prototype[name] = baseCtor.prototype[name];
            }
        });
    });
}

class Fullpage implements Options, Sliders {
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
    sliders: any;

    /**
     *Option
     */
    options: any;
    initOptionsSlider: any;
    getSlidesInSection: any;

    /**
     * Main constructor:
     */
    constructor(public selector: string, options = null) {
        /**
         * Init Options class
         */
        applyMixins(Fullpage, [Options, Sliders]);


        this.root = document.querySelector(this.selector);
        this.sections = this.root.querySelectorAll('.section-scroll');
        this.count_sections = this.sections.length - 1;
        this.duration = 600;
        this.lastAnimation = 0;
        this.idlePeriod = 100;


        //Init sliders options
        // console.log(Fullpage.prototype.initOptions(options));

        window.addEventListener('load', this.setEventListeners)
    }

    initOptions: (options) => any


    /**
     * Function scroll. Takes section to which need make scroll:
     */
    scroll = element => {
        let targetPos = element.getBoundingClientRect().top;
        let startPos = document.body.getBoundingClientRect().top;
        let offset = targetPos - startPos;
        window.scrollTo({top: offset, behavior: 'smooth'})
    };

    /**
     * Function set event wheel for each section. And check does it contain slider:
     */
    setEventListeners = () => {
        for (let i = 0; i < this.count_sections + 1; i++) {
            let hasSlider = this.sections[i].classList.contains("has-slider");
            this.sections[i].addEventListener('mousewheel', e => this.wheelEvent(e, i, hasSlider));
            hasSlider ? this.setSlidersSettings(i) : 0
        }
    };

    /**
     * Function set slider settings which will be needed when scrolling the slider:
     */
    setSlidersSettings = i => {
        this.sliders = [];
        let slides = this.getSlides(i);
        this.sliders.push({section_index: i, slides: slides, count: slides.length - 1});
    };

    getSlides = i => {
        let slides = this.sections[i].querySelectorAll('.slick-slide');
        let arr = [];
        for (let i = 0; i < slides.length; i++) {
            if (!slides[i].classList.contains('slick-cloned'))
                arr.push(slides[i])
        }
        return arr;
    };

    wheelEvent = (e, i, hasSlider) => {
        e.preventDefault();
        if (!this.checkCountEvents()) return;
        if (hasSlider) return this.sliderSlide(e.deltaY, i);
        if (e.deltaY > 0) {
            if (i + 1 <= this.count_sections) this.scroll(this.sections[i + 1]);
        } else {
            if (i - 1 >= 0) this.scroll(this.sections[i - 1]);
        }
        this.lastAnimation = new Date().getTime();
    };

    sliderSlide = (deltaY, i) => {
        if (!this.checkCountEvents()) return;

        let current_slider: any;
        for (let j = 0; j < this.sliders.length; j++) {
            if (this.sliders[j].section_index === i) {
                current_slider = this.sliders[j];
            }
        }
        let active_slide = parseInt($('.slick-current').attr("data-slick-index"));

        let y: any;
        y = $('.slick-slider');
        if (deltaY > 0) {
            if (active_slide < current_slider.count) {
                y.slick('slickNext')
            } else {
                this.scroll(this.sections[i + 1])
            }
        } else {
            if (active_slide > 0) {
                y.slick('slickPrev')
            } else {
                this.scroll(this.sections[i - 1])
            }
        }
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


new Fullpage('.root', {
    slider: ['.slick-slider']
});