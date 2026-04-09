export default class BIChart extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          position: relative;
        }

        line {
          stroke: lightgrey;
          stroke-width: 1px;
        }

        svg {
          box-sizing: border-box;
          display: block;
          height: 240px;
          width: 100%;
        }

        text.label {
          fill: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
        }

        text.xaxis {
          alignment-baseline: middle;
          fill: #1a1a1a;
          text-anchor: middle;
        }

        text.yaxis {
          alignment-baseline: middle;
          fill: #1a1a1a;
          text-anchor: start;
        }    

        #fill {
          fill: color-mix( in srgb, purple 25%, transparent );
          stroke: none;
        }        

        #line {
          fill: none;
          stroke: purple;
          stroke-width: 3px;
        }        

        @media screen and ( max-width: 430px ) {

        }        
      </style>
      <svg>
        <g>
          <text class="label yaxis" x="4" y="40">$90k</text>
          <text class="label yaxis" x="4" y="80">$85k</text>          
          <text class="label yaxis" x="4" y="120">$80k</text>                    
          <text class="label yaxis" x="4" y="160">$75k</text>                    
          <text class="label yaxis" x="4" y="200">$70k</text>          
        </g>
        <g>
          <text class="label xaxis" y="228">Apr</text>
          <text class="label xaxis" y="228">May</text>
          <text class="label xaxis" y="228">Jun</text>
          <text class="label xaxis" y="228">Jul</text>
          <text class="label xaxis" y="228">Aug</text>
          <text class="label xaxis" y="228">Sep</text>
          <text class="label xaxis" y="228">Oct</text>
          <text class="label xaxis" y="228">Nov</text>
          <text class="label xaxis" y="228">Dec</text>
          <text class="label xaxis" y="228">Jan</text>
          <text class="label xaxis" y="228">Feb</text>
          <text class="label xaxis" y="228">Mar</text>                                                  
        </g>
        <g>
          <line class="grid" x1="65" y1="40" x2="100%" y2="40" />
          <line class="grid" x1="65" y1="80" x2="100%" y2="80" />
          <line class="grid" x1="65" y1="120" x2="100%" y2="120" />
          <line class="grid" x1="65" y1="160" x2="100%" y2="160" />
          <line class="grid" x1="65" y1="200" x2="100%" y2="200" />
        </g>
        <path id="fill" />
        <path id="line" />
      </svg>
    `;

    // Private 
    this._data = [
      {month: "Apr", short: "Ap", mrr: 75000, growth: null, arr: 900000 },
      {month: "May", short: "Ma", mrr: 76800, growth: 3.0, arr: 927000 },
      {month: "Jun", short: "Jn", mrr: 75200, growth: 2.5, arr: 950160 },
      {month: "Jul", short: "Jl", mrr: 78100, growth: 2.5, arr: 973920 },
      {month: "Aug", short: "Au", mrr: 80500, growth: 3.0, arr: 1003200 },
      {month: "Sep", short: "Se", mrr: 79000, growth: 2.0, arr: 1023240 },
      {month: "Oct", short: "Oc", mrr: 82800, growth: 3.0, arr: 1053960 },
      {month: "Nov", short: "No", mrr: 84200, growth: 1.5, arr: 1069800 },
      {month: "Dec", short: "De", mrr: 81500, growth: 3.0, arr: 1101840 },
      {month: "Jan", short: "Ja", mrr: 86000, growth: 2.0, arr: 1123920 },
      {month: "Feb", short: "Fe", mrr: 87200, growth: 2.0, arr: 1146360 },
      {month: "Mar", short: "Mr", mrr: 84600, growth: -3.0, arr: 1111920 }
    ];
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );

    // Elements
    this.$chart = this.shadowRoot.querySelector( 'svg' );
    this.$fill = this.shadowRoot.querySelector( '#fill' );    
    this.$line = this.shadowRoot.querySelector( '#line' );
  }

  _draw() {
    const bounds = this.getBoundingClientRect();
    const inset = 32;    
    const mobile = 480;
    const months = this.shadowRoot.querySelectorAll( 'text.xaxis' );
    const start = window.innerWidth > mobile ? 81 : 75;
    const steps = window.innerWidth > mobile ? 12 : 13;

    let path = null;

    for( let m = 0; m < months.length; m++ ) {
      if( path === null ) {
        path = `M ${start + ( m * ( ( bounds.width - inset ) / steps ) )} ${this._map( this._data[m].mrr, 70000, 90000, 200, 40 )} `;
      } else {
        path = path + `L ${start + ( m * ( ( bounds.width - inset ) / steps ) )} ${this._map( this._data[m].mrr, 70000, 90000, 200, 40 )} `;        
      }

      months[m].setAttributeNS( null, 'x', start + ( m * ( ( bounds.width - inset ) / steps ) ) );
      months[m].textContent = window.innerWidth > mobile ? this._data[m].month : this._data[m].short;      
    }

    this.$line.setAttributeNS( null, 'd', path );

    path = path + `L ${start + ( ( months.length - 1 ) * ( ( bounds.width - inset ) / steps ) )} 199.5 L ${start} 199.5 Z`;
    this.$fill.setAttributeNS( null, 'd', path );
  }

  _map( value, inMin, inMax, outMin, outMax ) {
    return ( ( value - inMin ) * ( outMax - outMin ) ) / ( inMax - inMin ) + outMin;
  }

   // When attributes change
  _render() {;}

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
    // this._upgrade( 'label' ); 
    this._render();
    this._draw();
  }
  
  // Watched attributes
  static get observedAttributes() {
    return [];
  }

  // Observed attribute has changed
  // Update render
  attributeChangedCallback( name, old, value ) {
    this._render();
  } 
}

window.customElements.define( 'bi-chart', BIChart );
