import React from 'react'
import './DescriptionBox.css'

const DescriptionBox = () => {
  return (
    <div className='descriptionbox'>
        <div className="descriptionbox-navigator">
            <div className="descriptionbox-nav-box">Description</div>
            <div className="descriptionbox-nav-box fade">Reviews (122)</div>
        </div>
        <div className="descriptionbox-description">
            <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Assumenda eos ex voluptas eveniet repellendus dignissimos, reprehenderit tempora rem natus ullam iusto, nisi sit accusantium corrupti, maiores perspiciatis quaerat ipsa. Dolore?</p>
            <p>Lorem, ipsum dolor sit amet consectetur adipisicing elit. Vitae nam quae dolores quos sit natus saepe tempora veniam placeat nisi! Neque repellat ipsam voluptatem delectus voluptas earum reiciendis eius quo.</p>
        </div>
    </div>
  )
}

export default DescriptionBox