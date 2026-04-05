export default class BITable extends HTMLElement {
  constructor() {
    super();

    const template = document.createElement( 'template' );
    template.innerHTML = /* template */ `
      <style>
        :host {
          box-sizing: border-box;
          display: block;
          position: relative;
          width: 100%;
        }        

        header {
          display: grid;
          grid-template-columns: repeat( 6, 1fr );
        }

        header p {
          color: #1a1a1a;
          cursor: default;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 14px;
          font-weight: 600;
          line-height: 24px;
          margin: 0;
          padding: 5px 8px 5px 8px;
        }

        header p:first-of-type {
          padding: 5px 8px 5px 16px;          
        }

        li {
          cursor: pointer;
          border-bottom: solid 1px lightgrey;
        }

        li:last-of-type {
          border-bottom: none;
        }

        li div {
          display: grid;
          grid-template-columns: repeat( 6, 1fr );     
          width: 100%;     
        }

        li div p {
          color: #1a1a1a;
          font-family: 'Open Sans Variable', sans-serif;
          font-size: 16px;
          line-height: 24px;
          margin: 0;
          overflow: hidden;          
          padding: 8px;
          text-overflow: ellipsis;                    
          white-space: nowrap;          
        }

        li div p:first-of-type {
          padding: 8px 8px 8px 16px;
        }

        li:hover {
          background: #f4f4f4;
        }

        ul {
          background: white;
          border: solid 1px lightgrey;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          list-style: none;
          margin: 0;
          overflow: hidden;
          padding: 0;
        }
      </style>
      <header>
        <p>ID</p>
        <p>Account</p>  
        <p>Stage</p>                    
        <p>Amount</p>                            
        <p>Owner</p>                    
        <p>Close Date</p>                    
      </header>
      <ul>
        <li>
          <div>
            <p>D-1023</p>
            <p>North Traders</p>
            <p>Proposal</p>
            <p>85,000</p>
            <p>Sarah Chen</p>
            <p>2026-04-10</p>                                                            
          </div>
        </li>
        <li>
          <div>
            <p>D-1041</p>
            <p>Apex Manufacturing</p>
            <p>Negotiation</p>
            <p>120,000</p>
            <p>Mike Johnson</p>
            <p>2026-04-15</p>                                                            
          </div>
        </li>
        <li>
          <div>
            <p>D-1035</p>
            <p>GreenLeaf Foods</p>
            <p>Qualification</p>
            <p>92,000</p>
            <p>Priya Singh</p>
            <p>2026-04-22</p>                                                            
          </div>
        </li>        
        <li>
          <div>
            <p>D-1019</p>
            <p>Summit Logistics</p>
            <p>Negotiation</p>
            <p>150,000</p>
            <p>Emily Carter</p>
            <p>2026-04-27</p>                                                            
          </div>
        </li>               
        <li>
          <div>
            <p>D-1052</p>
            <p>Horizon Health</p>
            <p>Proposal</p>
            <p>110,000</p>
            <p>Alex Turner</p>
            <p>2026-05-02</p>                                                            
          </div>
        </li>                        
      </ul>
    `;
    
    // Root
    this.attachShadow( {mode: 'open'} );
    this.shadowRoot.appendChild( template.content.cloneNode( true ) );
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
    this._render();
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

window.customElements.define( 'bi-table', BITable );
