import './ie10-viewport-bug-workaround.js'
import './jquery.min.js'
import './backstretch.min.js'
import './jquery.bxslider.js'
import './wow.min.js'
import './scrollTo.min.js'
import './validate.js'

let screenWidth = window.innerWidth > 0 ? window.innerWidth : screen.width
let headerHeight
const sm = 767
const sliders = []

const onScroll = () => {
  headerHeight = $('header').height()

  if (screenWidth <= sm) {
    $(window).scrollTop() > headerHeight
      ? $('nav:not(.visible) .toggler').addClass('scrolled')
      : $('.toggler').removeClass('scrolled')
  }
}

const buildMenu = () => {
  $('.toggler').on('click', function () {
    $('nav').toggleClass('visible')
    $(this).toggleClass('clicked')

    if ($('nav').hasClass('visible')) {
      $(this).removeClass('scrolled')
    }

    if (!$(this).hasClass('clicked')) {
      if (screenWidth <= sm) {
        $(window).scrollTop() > headerHeight
          ? $('.toggler').addClass('scrolled')
          : $('.toggler').removeClass('scrolled')
      }
    }
  })

  $('nav li a').on('click', function () {
    if (screenWidth <= sm) {
      $('nav').toggleClass('visible')
      $('.toggler').toggleClass('clicked')
    }
  })
}

const updateSliderCaption = (index, container, device) => {
  const caption = $(`#unidades .bxslider.${device} li:not(.bx-clone)`)
    .eq(index)
    .data('caption')

  $(`${container} .slider.${device} .caption`).text(caption)
}

const buildSlider = (config) => {
  const { container, device, isCaptionEnabled } = config

  return $(`${container} .bxslider.${device}`).bxSlider({
    auto: $(`${container} .bxslider.${device} li`).length > 1,
    controls: false,
    keyboardEnabled: true,
    mode: 'horizontal',
    pager: true,
    pause: 4000,
    responsive: true,
    speed: 1000,
    onSliderLoad: (currentIndex) => {
      if (!isCaptionEnabled) return
      updateSliderCaption(currentIndex, container, device)
    },
    onSlideAfter: (slideElement, oldIndex, newIndex) => {
      if (!isCaptionEnabled) return
      updateSliderCaption(newIndex, container, device)
    }
  })
}

const generateSliders = () => {
  $('.bxslider li').each(function (i) {
    $(this).backstretch($(this).attr('data-bg'))
  })

  const headerSmSlider = buildSlider({
    container: 'header',
    device: 'sm',
    isCaptionEnabled: false
  })

  const headerMdSlider = buildSlider({
    container: 'header',
    device: 'md',
    isCaptionEnabled: false
  })

  const unitsSmSlider = buildSlider({
    container: '#unidades',
    device: 'sm',
    isCaptionEnabled: true
  })

  const unitsMdSlider = buildSlider({
    container: '#unidades',
    device: 'md',
    isCaptionEnabled: true
  })

  sliders.push(headerSmSlider, headerMdSlider, unitsSmSlider, unitsMdSlider)
}

const buildForm = () => {
  $('form').validate({
    rules: {
      first_name: {
        required: true
      },
      last_name: {
        required: true
      },
      email: {
        required: true,
        email: true
      },
      phone: {
        required: true
      },
      query: {
        required: true
      }
    },
    errorClass: 'error',
    errorPlacement: function (error, element) {
      $(element).prev().children().text(error[0].innerText)
    },
    success: function (label, element) {
      $(element).prev().children().text('')
    },
    submitHandler: function (form) {
      $('form button').text('Enviando...')
      const firstName = $('form [name="first_name"]').val()
      const lastName = $('form [name="last_name"]').val()
      const email = $('form [name="email"]').val()
      const phone = $('form [name="phone"]').val()
      const query = $('form [name="query"]').val()

      const data = `first_name=${firstName}&last_name=${lastName}&email=${email}&phone=${phone}$query=${query}`

      $.ajax({
        type: 'POST',
        url: `http://127.0.0.1:5500/mailing`,
        data: data,
        dataType: 'json',
        success: function (response) {
          if (response.status != 'OK') {
            $('.response').html(response.msg).show().animate(
              {
                opacity: 1
              },
              500
            )
            $('form button').text('Enviar')
          } else {
            $('form')[0].reset()
            $('form button').text('Enviar')
            $('.response').html(response.msg).animate(
              {
                opacity: '1'
              },
              500
            )
            setTimeout(function () {
              $('.response').html(response.msg).css('opacity', 0)
            }, 4000)
          }

          setTimeout(function () {
            $('form button').text('Enviar')
            $('.response').css('opacity', 0)
          }, 4000)
        }
      })

      return false
    }
  })
}

const setCurrentYear = () => {
  $('#current-year').text(new Date().getFullYear())
}

$(function () {
  $(document).on('scroll', onScroll)
  buildMenu()
  buildForm()
  setCurrentYear()
})

$(window).on('resize', () => {
  setTimeout(function () {
    screenWidth = window.innerWidth > 0 ? window.innerWidth : screen.width
    if (screenWidth <= sm) {
      $('nav').removeClass('scrolled')
    }
  }, 500)

  sliders.forEach((slider) => slider.reloadSlider())
})

$(window).on('load', () => {
  $('#loader').delay(1000).fadeOut('slow')
  onScroll()
  generateSliders()
})

const developer = {
  first_name: 'Jorman',
  last_name: 'Espinoza',
  email: 'espinoza.dev@gmail.com'
}

console.info({ developer })
