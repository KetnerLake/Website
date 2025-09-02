export default class HoytBenefitItem extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: inline-flex;
          flex-direction: row;
          margin: 0 0 32px 0;
          position: relative;
        } 

        div {
          display: flex;
          flex-direction: column;
          padding: 0 0 0 16px;
        }

        h4 {
          color: #272727;
          font-family: 'Open Sans', sans-serif;
          font-size: 18px;
          font-weight: 700;
          line-height: 28px;
          margin: 0 0 8px 0;
          padding: 0;
        }

        p[part=content] {
          color: #64748b;
          font-family: 'Open Sans', sans-serif;
          font-size: 16px;
          font-weight: 400;
          line-height: 24px;
          margin: 0;
          padding: 0;
        }

        p[part=icon] {
          font-size: 24px;
          line-height: 28px;
          margin: 0;
          padding: 4px 0 0 0;
          width: 24px;       
        }
      </style>
      <p part="icon"></p>
      <div>
        <h4></h4>
        <p part="content">
          <slot></slot>
        </p>      
      </div>
    `;

    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$icon = this.shadowRoot.querySelector( 'p[part=icon]' );
    this.$label = this.shadowRoot.querySelector( 'h4' );    
  }

  // When attributes change
  _render() {
    this.$icon.textContent = this.icon === null ? '' : this.icon;
    this.$label.textContent = this.label === null ? '' : this.label;    
  }

  // Promote properties
  // Values may be set before module load
  _upgrade( property ) {
    if( this.hasOwnProperty( property ) ) {
      const value = this[property];
      delete this[property];
      this[property] = value;
    }
  }

  // Setup
  connectedCallback() {
    this._upgrade( 'icon' );            
    this._upgrade( 'label' );                
    this._render();
  }

  // Watched attributes
  static get observedAttributes() {
    return [
      'icon',
      'label'
    ];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 

  // Attributes
  // Reflected
  // Boolean, Float, Integer, String, null
  get icon() {
    if( this.hasAttribute( 'icon' ) ) {
      return this.getAttribute( 'icon' );
    }

    return null;
  }

  set icon( value ) {
    if( value !== null ) {
      this.setAttribute( 'icon', value );
    } else {
      this.removeAttribute( 'icon' );
    }
  }

  get label() {
    if( this.hasAttribute( 'label' ) ) {
      return this.getAttribute( 'label' );
    }

    return null;
  }

  set label( value ) {
    if( value !== null ) {
      this.setAttribute( 'label', value );
    } else {
      this.removeAttribute( 'label' );
    }
  }  
}

window.customElements.define( 'krh-benefit-item', HoytBenefitItem );
