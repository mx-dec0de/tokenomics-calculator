<template>
  <div id="app">
    <section class="section has-background-light">
      <div class="container  columns">
        <div class="column is-12">
          <div class="box content">
            <h1>Tokenomics Calculator</h1>
            <h4>1. Fundraising (Goal: ${{ fundraisingTotal|money }})</h4>
            <template>
                <div class="columns is-multiline">
                  <div  v-for="(item,key) in Input.Fundraising.Rounds" :key="item.Id" class="column is-6">
                  
                    <div class="card">
                      <div class="card-content">
                        <div class="content">
                         
                          <b-field>                
                                <b-radio @input="renderd()" v-model="Input.Fundraising.Rounds[key].IsInvestors"
                                    native-value="true">
                                    Investors
                                </b-radio>
                                <b-radio @input="renderd()" v-model="Input.Fundraising.Rounds[key].IsInvestors"
                                    native-value="false">
                                    Public Sale
                                </b-radio>
                            </b-field> 
                          <div class="columns">
                            <div class="column is-6">
                              
                              <b-field label="Round Name" label-position="inside">
                                  <b-input v-model="Input.Fundraising.Rounds[key].Name"></b-input>
                              </b-field>
                            </div>
                            <div class="column is-6">
                              <b-field label="Sum To Raise, (USD)" label-position="inside">
                                  <b-input @input="renderd()" v-model="Input.Fundraising.Rounds[key].FundsToRaise"></b-input>
                              </b-field>
                            </div>  
                        </div>
                        <div class="columns">
                            <div class="column is-4">
                                <b-field label="ROI (x)" label-position="inside">
                                <b-input @input="renderd()" v-model="Input.Fundraising.Rounds[key].ROI"></b-input>
                                </b-field>
                            </div>
                            <div class="column is-4">
                                <b-field label="Advisor %" label-position="inside">
                                  <b-input @input="renderd()" v-model="Input.Fundraising.Rounds[key].AdvisorReward"></b-input>
                              </b-field>
                            </div>
                            <div class="column is-4">
                              <b-field label="Liq Res, %" label-position="inside">
                              <b-input  v-model="Input.Fundraising.Rounds[key].LiquidityReserveRatio"></b-input>
                          </b-field>
                            
                            </div>
                          </div>  
                          
                          
                         
                          
                          
                    
                        </div>
                      
                        <div class="buttons has-addons is-centered">
                          <button class="button" @click="moveleftFundraisingRound(key)">&larrb;</button>
                          <button class="button is-expanded" @click="deleteFundraisingRound(key)">Delete</button>
                          <button class="button" @click="moverightFundraisingRound(key)">&rarrb;</button>
                        </div>

                      </div>
                    </div>
                  </div>
                </div>
            </template>
            <template>
                <section>
                    <b-button @click="addFundraisingRound(Input.Fundraising.Rounds.length)">Add Round</b-button>
                </section>
            </template>
          </div>
          <template  v-if="fundraisingMap.InvestorsSupply>0">
          <div class="box content">
            <h4>2. Listing</h4>
            <div class="columns">
              <div class="column is-4">
                  <b-field label="Initial Price, USD" >
                                <b-input @input="renderd()" v-model="Input.Listing.InitialPrice"></b-input>
                  </b-field>

              </div>
              <div class="column is-4">
                  <p>Liquidity Reserve is:</p>
                  <p class="is-size-4">${{  liqRes|money }}</p>
                  <p>Remaining Funds are:</p>
                  <p class="is-size-4">${{  (fundraisingMap.TotalRaised - liqRes)|money }}</p>

              </div>
              <div class="column is-4">
                <b-field label="OneTime Payments, USD" >
                                <b-input @input="renderd()" v-model="Input.Listing.OneTimePayments"></b-input>
                  </b-field>
                  <b-field grouped label="DEX Liq Coverage">
                
                <b-slider   @input="renderd()" :max="100" :step="1"  v-model="Input.Listing.DEXLiqCoverage" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator lazy></b-slider>
            </b-field>
            <b-field grouped label="CEX Liq Coverage">
                
                <b-slider   @input="renderd()" :max="100" :step="1"  v-model="Input.Listing.CEXLiqCoverage" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator lazy></b-slider>
            </b-field>
              </div>
            </div>
            </div>
            <div class="box content">
              <h4>3. Distribution</h4>
              <b-field grouped label="Investors' share of the total supply">
                
                <b-slider :class="(Input.Distribution.InvestorsShare>=Limits.Investors.min&&Input.Distribution.InvestorsShare<=Limits.Investors.max)?'is-success':'is-danger'" v-model="Input.Distribution.InvestorsShare"  @input="renderd()" :max="Render.InvestorsMaxRatio" :step="1/10**ratioDecimals" :custom-formatter="(val) => val + '%'" :tooltip="false" indicator lazy></b-slider>
            </b-field>

            <table class="has-text-right">
              <thead>
                <th>Section</th>
                <th>Category</th>
                <th>Share</th>
                <th width="16px">&bull;</th>
                <th>Supply</th>
                <th width="16px">&bull;</th>
                <th width="20%">Details</th>
              </thead>
              <tr>
                <th rowspan="4">Fundraising</th>
                <td>Investors</td>
                <td class="has-text-right"><b-input v-model="Input.Distribution.InvestorsShare" type="float" class="has-text-right"></b-input></td><td>%</td>
                <td>{{ fundraisingMap.InvestorsSupply|money }}</td><td> &curren;</td>
                <td rowspan="4">
                  <p class="has-text-danger has-text-weight-bold" v-if="Input.Distribution.InvestorsShare > Limits.Investors.max">Investors share can't be more than {{ Limits.Investors.max }}%.</p>
                  <p class="has-text-danger has-text-weight-bold" v-if="Render.AdvisorsRatio > Limits.Advisors.max">Advisors share can't be more than {{ Limits.Advisors.max }}%.</p>

                </td>
              </tr>
              <tr>
                <td>Public Sale</td>
                <td>{{ dformat(Render.PublicSaleRatio,ratioDecimals) }}</td><td>%</td>
                <td>{{ fundraisingMap.PublicSaleSupply|money }}</td><td> &curren;</td>
              </tr>
              <tr>
                <td>Advisors</td>
                <td>{{ dformat(Render.AdvisorsRatio,ratioDecimals) }}</td><td>%</td>
                <td>{{ fundraisingMap.AdvisorsSupply|money }} </td><td>&curren;</td>
              </tr>
              <tr>
                <th>Subtotal</th>
                <th>{{ dformat(parseFloat(Input.Distribution.InvestorsShare) + parseFloat(Render.PublicSaleRatio) + parseFloat(Render.AdvisorsRatio),ratioDecimals) }} </th><th> %</th>
                <th>{{ (fundraisingMap.InvestorsSupply + fundraisingMap.PublicSaleSupply+ fundraisingMap.AdvisorsSupply)|money }} </th><th>&curren;</th>
              </tr>

              <tr>
                <th rowspan="3">Team</th>
                <td>Founders</td>
                <td><b-field>
                  <b-input @input="renderd('FoundersShare')" v-model="Input.Distribution.FoundersShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('FoundersSupply')" v-model="Input.Distribution.FoundersSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
                <td rowspan="3"> <p class="has-text-danger has-text-weight-bold" v-if="(parseInt(Input.Distribution.DevsShare) + parseInt(Input.Distribution.FoundersShare)) > Limits.Team.max">Team's share can't be more than {{ Limits.Team.max }}%.</p><p class="has-text-danger has-text-weight-bold" v-if="(parseInt(Input.Distribution.DevsShare) + parseInt(Input.Distribution.FoundersShare)) < Limits.Team.min">Team's share can't be less than {{ Limits.Team.min }}%.</p></td>
              </tr>
              <tr>
                <td>Developers</td>
                <td><b-field>
                  <b-input @input="renderd('DevsShare')" v-model="Input.Distribution.DevsShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('DevsSupply')" v-model="Input.Distribution.DevsSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
              </tr>
              <tr>
                <th>Subtotal</th>
                <th>{{ dformat(parseFloat(Input.Distribution.FoundersShare) + parseFloat(Input.Distribution.DevsShare),ratioDecimals) }} </th><th> %</th>
                <th>{{ (parseFloat(Input.Distribution.DevsSupply)+ parseFloat(Input.Distribution.FoundersSupply))|money }} </th><th>&curren;</th>
              </tr>



              <tr>
                <th rowspan="3">Liquidity</th>
                <td>CEX</td>
                <td><b-field>
                  <b-input @input="renderd('CEXListingShare')" v-model="Input.Distribution.CEXListingShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('CEXListingSupply')" v-model="Input.Distribution.CEXListingSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
                <td rowspan="3"> ... </td>
              </tr>
              <tr>
                <td>DEX</td>
                <td><b-field>
                  <b-input @input="renderd('DEXListingShare')" v-model="Input.Distribution.DEXListingShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('DEXListingSupply')" v-model="Input.Distribution.DEXListingSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
              </tr>
              <tr>
                <th>Subtotal</th>
                <th>{{ dformat(parseFloat(Input.Distribution.DEXListingShare) + parseFloat(Input.Distribution.CEXListingShare),ratioDecimals) }} </th><th> %</th>
                <th>{{ (parseFloat(Input.Distribution.DEXListingSupply)+ parseFloat(Input.Distribution.CEXListingSupply))|money }} </th><th>&curren;</th>
              </tr>

             <tr>
                <th rowspan="3">Community</th>
                <td>Airdrop</td>
                <td><b-field>
                  <b-input @input="renderd('CommunityAirdropShare')" v-model="Input.Distribution.CommunityAirdropShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('CommunityAirdropSupply')" v-model="Input.Distribution.CommunityAirdropSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
                <td rowspan="3"> ... </td>
              </tr>
              <tr>
                <td>Farming</td>
                <td><b-field>
                  <b-input @input="renderd('CommunityFarmingShare')" v-model="Input.Distribution.CommunityFarmingShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('CommunityFarmingSupply')" v-model="Input.Distribution.CommunityFarmingSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
              </tr>
              <tr>
                <td>Rewards</td>
                <td><b-field>
                  <b-input @input="renderd('CommunityRewardsShare')" v-model="Input.Distribution.CommunityRewardsShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('CommunityRewardsSupply')" v-model="Input.Distribution.CommunityRewardsSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
              </tr>
              <tr>
                <td></td>
                <th>Subtotal</th>
                <th>{{ dformat(parseFloat(Input.Distribution.CommunityAirdropShare) + parseFloat(Input.Distribution.CommunityRewardsShare)+ parseFloat(Input.Distribution.CommunityFarmingShare),ratioDecimals) }} </th><th> %</th>
                <th>{{ (parseFloat(Input.Distribution.CommunityRewardsSupply)+ parseFloat(Input.Distribution.CommunityFarmingSupply)+ parseFloat(Input.Distribution.CommunityAirdropSupply))|money }} </th><th>&curren;</th>
              </tr>

              <tr>
                <th rowspan="3">Treasury</th>
                <td>Development</td>
                <td><b-field>
                  <b-input @input="renderd('TreasuryDevelopmentShare')" v-model="Input.Distribution.TreasuryDevelopmentShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('TreasuryDevelopmentSupply')" v-model="Input.Distribution.TreasuryDevelopmentSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
                <td rowspan="3"> ... </td>
              </tr>
              <tr>
                <td>Marketing</td>
                <td><b-field>
                  <b-input @input="renderd('TreasuryMarketingShare')" v-model="Input.Distribution.TreasuryMarketingShare" size="is-small"></b-input>
                </b-field>
                </td>
                <td>%</td>
                <td><b-input @input="renderd('TreasuryMarketingSupply')" v-model="Input.Distribution.TreasuryMarketingSupply" size="is-small"></b-input></td>
                <td>&curren;</td>
              </tr>
              <tr>
                <td>Reserve</td>
                <td>{{ dformat(Render.Remaining,ratioDecimals)}}
                </td>
                <td>%</td>
                <td>{{ (Render.RemainingSupply)|money }}</td>
                <td>&curren;</td>
              </tr>
              <tr>
                <td></td>
                <th>Subtotal</th>
                <th>{{ dformat(parseFloat(Input.Distribution.TreasuryDevelopmentShare) + parseFloat(Input.Distribution.TreasuryMarketingShare)+ parseFloat(Render.Remaining),ratioDecimals) }} </th><th> %</th>
                <th>{{ (parseFloat(Input.Distribution.TreasuryDevelopmentSupply)+ parseFloat(Input.Distribution.TreasuryMarketingSupply)+ parseFloat(Render.RemainingSupply))|money }} </th><th>&curren;</th>
              </tr>

              <tr>
                <th>Total Supply</th><td></td>
                <td>100</td><td>%</td>
                <td>{{ Render.TotalSupply|money }}</td><td> &curren;</td>
              </tr>
              
            </table>

          </div>
        </template>
        </div>
        <div class="column is-12">
          <div class="section">
            <b-field label="Price precision (Decimals)">
                    <b-slider size="is-medium" :min="0" :max="10" v-model="priceDecimals" @input="renderd()">
                      <template v-for="val in [0,1,2,3,4,5,6,7,8,9,10]">
                            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
                        </template>
                    </b-slider>
                </b-field>
                <b-field label="Ratio precision (Decimals)">
                    <b-slider size="is-medium" :min="0" :max="10" v-model="ratioDecimals"  @input="renderd()">
                        <template v-for="val in [0,1,2,3,4,5,6,7,8,9,10]">
                            <b-slider-tick :value="val" :key="val">{{ val }}</b-slider-tick>
                        </template>
                    </b-slider>
                </b-field>
              </div>
          <div v-if="fundraisingMap.InvestorsSupply<=0" class="box content">
          
          <h1>Revise fundraising policy</h1>
          <h4>At least one fundraising round for Investors required!</h4>
          </div>

          <div v-if="fundraisingMap.InvestorsSupply>0" class="box content">
            <h1>Tokenomics</h1>

            <h2>Allocation</h2>
              <div class="columns">
                <div class="column is-half">
                  <p>Total supply: <span class="is-size-2">{{ Render.TotalSupply|money }} &curren;</span></p>
                  <table>
                    <thead>
                      <th>Section</th>
                      <th>Share</th>
                      <th>Supply</th>
                    </thead>
                    <tr>
                      <th>Fundraising</th>
                      <td>{{ dformat(100*fundraisingMap.TotalSupply/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (fundraisingMap.TotalSupply)|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Team</th>
                      <td>{{ dformat(100*(Input.Distribution.DevsSupply + Input.Distribution.FoundersSupply )/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (Input.Distribution.DevsSupply + Input.Distribution.FoundersSupply )|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Liquidity</th>
                      <td>{{ dformat(100*(Input.Distribution.CEXListingSupply + Input.Distribution.DEXListingSupply )/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (Input.Distribution.CEXListingSupply + Input.Distribution.DEXListingSupply )|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Community</th>
                      <td>{{ dformat(100*(Input.Distribution.CommunityAirdropSupply + Input.Distribution.CommunityRewardsSupply + Input.Distribution.CommunityFarmingSupply)/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (Input.Distribution.CommunityAirdropSupply + Input.Distribution.CommunityRewardsSupply + Input.Distribution.CommunityFarmingSupply)|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Treasury</th>
                      <td>{{ dformat(100*(Input.Distribution.TreasuryDevelopmentSupply + Render.RemainingSupply + Input.Distribution.TreasuryMarketingSupply)/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (Input.Distribution.TreasuryDevelopmentSupply + Render.RemainingSupply + Input.Distribution.TreasuryMarketingSupply)|money }} &curren;</td>
                    </tr>
                  </table>  
                </div>
                <div class="column is-half">
                  <template>
                    <div>
                      <apex-chart width="100%" type="donut" :options="chartOptionsAllocation" :series="seriesAllocation"></apex-chart>
                    </div>
                  </template>
                </div>
              </div>


              <h2>Distribution</h2>
              <div class="columns">
                <div class="column is-half">
                  <p>Total distributed supply: <span class="is-size-2">{{ Render.TotalSupply - (this.Input.Distribution.TreasuryDevelopmentSupply+this.Input.Distribution.TreasuryMarketingSupply + this.Render.RemainingSupply + this.Input.Distribution.CEXListingSupply+this.Input.Distribution.DEXListingSupply)|money }} &curren;</span></p>
                  <table>
                    <thead>
                      <th>Section</th>
                      <th>Share</th>
                      <th>Supply</th>
                    </thead>
                    <tr>
                      <th>Investors</th>
                      <td>{{ dformat(100*fundraisingMap.InvestorsSupply/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (fundraisingMap.InvestorsSupply)|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Team</th>
                      <td>{{ dformat(100*(Input.Distribution.DevsSupply + Input.Distribution.FoundersSupply )/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (Input.Distribution.DevsSupply + Input.Distribution.FoundersSupply )|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Advisors</th>
                      <td>{{ dformat(100*(fundraisingMap.AdvisorsSupply )/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (fundraisingMap.AdvisorsSupply)|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Community</th>
                      <td>{{ dformat(100*(this.Input.Distribution.CommunityAirdropSupply+this.Input.Distribution.CommunityFarmingSupply + this.Input.Distribution.CommunityRewardsSupply + this.fundraisingMap.PublicSaleSupply)/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (this.Input.Distribution.CommunityAirdropSupply+this.Input.Distribution.CommunityFarmingSupply + this.Input.Distribution.CommunityRewardsSupply + this.fundraisingMap.PublicSaleSupply)|money }} &curren;</td>
                    </tr>
                    <tr>
                      <th>Other (Liq, Tre)</th>
                      <td>{{ dformat(100*(this.Input.Distribution.TreasuryDevelopmentSupply+this.Input.Distribution.TreasuryMarketingSupply + this.Render.RemainingSupply + this.Input.Distribution.CEXListingSupply+this.Input.Distribution.DEXListingSupply)/Render.TotalSupply,ratioDecimals) }} %</td>
                      <td>{{ (this.Input.Distribution.TreasuryDevelopmentSupply+this.Input.Distribution.TreasuryMarketingSupply + this.Render.RemainingSupply + this.Input.Distribution.CEXListingSupply+this.Input.Distribution.DEXListingSupply)|money }} &curren;</td>
                    </tr>
                  </table>  
                </div>
                <div class="column is-half">
                  <template>
                    <div>
                      <apex-chart width="100%" type="donut" :options="chartOptionsDistribution" :series="seriesDistribution"></apex-chart>
                    </div>
                  </template>
                </div>
              </div>

            <h2>Fundraising</h2>
            <h3>General</h3>
            <p>The number of tokens issued for all these stages is <span class="is-size-3">{{ fundraisingMap.TotalSupply|money }} &curren;</span>.</p>
            <div class="table-container">
              <table class="table">
                <thead>
                  <th>Distribution</th>
                  <th v-if="fundraisingMap.InvestorsSupply>0">Investors</th>
                  <th v-if="fundraisingMap.PublicSaleSupply>0">PublicSale</th>
                  <th v-if="fundraisingMap.AdvisorsSupply>0">Advisors</th>
                </thead>
                <tr>
                  <th>Supply</th>
                  <td v-if="fundraisingMap.InvestorsSupply>0">{{ fundraisingMap.InvestorsSupply|money }} &curren;</td>
                  <td  v-if="fundraisingMap.PublicSaleSupply>0">{{ fundraisingMap.PublicSaleSupply|money }} &curren;</td>
                  <td v-if="fundraisingMap.AdvisorsSupply>0">{{ fundraisingMap.AdvisorsSupply|money }} &curren;</td>
                </tr>
                <tr>
                  <th>Spent $ or eq</th>
                  <td v-if="fundraisingMap.InvestorsSupply>0">${{ fundraisingMap.InvestorsNetWorthA|money }} </td>
                  <td  v-if="fundraisingMap.PublicSaleSupply>0">${{ fundraisingMap.PublicSaleNetWorthA|money }} </td>
                  <td v-if="fundraisingMap.AdvisorsSupply>0">${{ fundraisingMap.AdvisorsNetWorthA|money }}</td>
                </tr>
                <tr>
                  <th>Net Worth</th>
                  <td v-if="fundraisingMap.InvestorsSupply>0">${{ fundraisingMap.InvestorsNetWorthB|money }} </td>
                  <td v-if="fundraisingMap.PublicSaleSupply>0">${{ fundraisingMap.PublicSaleNetWorthB|money }} </td>
                  <td v-if="fundraisingMap.AdvisorsSupply>0">${{ fundraisingMap.AdvisorsNetWorthB|money }}</td>
                </tr>
                <tr>
                  <th>Avg ROI</th>
                  <td v-if="fundraisingMap.InvestorsSupply>0">x{{ dformat( fundraisingMap.InvestorsNetWorthB/fundraisingMap.InvestorsNetWorthA,ratioDecimals) }} (or +{{ dformat(100 * fundraisingMap.InvestorsNetWorthB/fundraisingMap.InvestorsNetWorthA,ratioDecimals) - 100 }}%)</td>
                  <td  v-if="fundraisingMap.PublicSaleSupply>0">x{{ dformat( fundraisingMap.PublicSaleNetWorthB/fundraisingMap.PublicSaleNetWorthA,ratioDecimals) }} (or +{{ dformat(100 * fundraisingMap.PublicSaleNetWorthB/fundraisingMap.PublicSaleNetWorthA,ratioDecimals) - 100 }}%)</td>
                  <td v-if="fundraisingMap.AdvisorsSupply>0">x{{ dformat( fundraisingMap.AdvisorsNetWorthB/fundraisingMap.AdvisorsNetWorthA,ratioDecimals) }} (or +{{ (dformat(100 * fundraisingMap.AdvisorsNetWorthB/fundraisingMap.AdvisorsNetWorthA,ratioDecimals) - 100).toFixed(ratioDecimals) }}%)</td>
                </tr>
              </table>
              <p>The average price of 1 purchased token is <span class="is-size-3">${{ dformat(fundraisingMap.AvgPrice,priceDecimals) }}</span></p>
              <p>The average price of 1 issued token is <span class="is-size-4">${{ dformat(fundraisingMap.AvgPricePerIssued,priceDecimals) }}</span></p>

              <h3>Fundraising Rounds</h3>
              <p>The fundraising process is divided into {{ fundraisingMap.RoundNumber }} rounds.</p>
              <table>
                <thead>
                    <th>Round</th>
                    <th>Supply</th>
                    <th>Price</th>
                    <th>Raised</th>
                    <th>Advisors</th>
                  </thead>
                <tr v-for="(round,key1) in fundraisingMap.Rounds" :key="key1">
                  <th>{{ key1+1 }}. {{ Input.Fundraising.Rounds[key1].Name }}</th>
                  <td>{{ fundraisingMap.Rounds[key1].Supply|money }} &curren;</td>
                  <td>${{ dformat(fundraisingMap.Rounds[key1].Price,priceDecimals)}} </td>
                  <td>$ {{ round.Raised|money }}</td>
                  <td>{{ round.AdvisorSupply|money }} &curren; </td>
                </tr>
              </table>

            </div>
            



            <h2>Listing</h2>
            
            <table>
              <thead>
                <th>Section</th>
                <th>Tokens</th>
                <th>Coverage</th>
                <th>Assets</th>
              </thead>
              <tr>
                <th>OneTime Payment</th>
                <td></td>
                <td>100%</td>
                <td>$ {{ Input.Listing.OneTimePayments|money }}</td>
              </tr>
              <tr>
                <th>CEX Listing</th>
                <td>{{ Input.Distribution.CEXListingSupply|money }} &curren;</td>
                <td>{{ Input.Listing.CEXLiqCoverage }}%</td>
                <td>$ {{ (Input.Listing.CEXLiqCoverage*Input.Listing.InitialPrice*Input.Distribution.CEXListingSupply/100)|money }}</td>
              </tr>
              <tr>
                <th>DEX Listing</th>
                <td>{{ Input.Distribution.DEXListingSupply|money }} &curren;</td>
                <td>{{ Input.Listing.DEXLiqCoverage }}%</td>
                <td>$ {{ (Input.Listing.DEXLiqCoverage*Input.Listing.InitialPrice*Input.Distribution.DEXListingSupply/100)|money }}</td>
              </tr>
              <tr>
                <th>Subtotal</th>
                <td>{{ (Input.Distribution.DEXListingSupply+Input.Distribution.CEXListingSupply)|money }} &curren;</td>
                <td></td>
                <td>$ {{ ( Input.Listing.OneTimePayments+(Input.Listing.CEXLiqCoverage*Input.Listing.InitialPrice*Input.Distribution.CEXListingSupply/100)+Input.Listing.DEXLiqCoverage*Input.Listing.InitialPrice*Input.Distribution.DEXListingSupply/100)|money }}</td>
              </tr>
              <tr>
                <th>Raised Funds</th>
                <td></td>
                <td></td>
                <td>$ {{ liqRes|money }}</td>
              </tr>
              <tr>
                <th>Total</th>
                <td></td>
                <td></td>
                <td>$ {{ (liqRes - ( Input.Listing.OneTimePayments+(Input.Listing.CEXLiqCoverage*Input.Listing.InitialPrice*Input.Distribution.CEXListingSupply/100)+Input.Listing.DEXLiqCoverage*Input.Listing.InitialPrice*Input.Distribution.DEXListingSupply/100))|money }}</td>
              </tr>
            </table>

          </div>
        </div>
      </div>
    </section>
   
  </div>
</template>

<script>

export default {
  name: 'App',
  data() {
    return {
      a:0,
      priceDecimals:5,
      ratioDecimals:2,
      options: {
        chart: {
          id: 'vuechart-example'
        },
        xaxis: {
          categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998]
        }
      },
      series: [{
        name: 'series-1',
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }],
      options2: {},
      seriesAllocation: [12],
      chartOptionsAllocation: {
          labels: ["a"],
          formatter: function (val) {
            return val + "%"
          }
      },
      seriesDistribution: [],
      chartOptionsDistribution: {
          labels: ["a"],
          formatter: function (val) {
            return val + "%"
          }
      },
      Input:{
        Fundraising:{
            Rounds:[],
            InvestorsRatio:0
        },    
        Listing:{
          InitialPrice: 0.05,
          DEXLiqCoverage:80,
          CEXLiqCoverage:80,
          OneTimePayments:500000
        },
        Distribution:
        {
          InvestorsShare: 10,
          FoundersShare:0,
          FoundersSupply:0,
          DevsShare:0,
          DevsSupply:0,
          CEXListingSupply:0,
          CEXListingShare:0,
          DEXListingSupply:0,
          DEXListingShare:0,
          CommunityAirdropShare:0,
          CommunityAirdropSupply:0,
          CommunityRewardsShare:0,
          CommunityRewardsSupply:0,
          CommunityFarmingShare:0,
          CommunityFarmingSupply:0,
          TreasuryDevelopmentShare:0,
          TreasuryDevelopmentSupply:0,
          TreasuryMarketingShare:0,
          TreasuryMarketingSupply:0,

        }

      },
      Render:{

      },
      Limits:{
        Investors:{min:0, max: 20},
        Advisors:{min:0, max:3},
        Team:{min:15, max:20},
        Treasury:{min:20, max:50},
        Community:{min:15, max:50},
        PublicSale:{min:0, max:10},
  
        Other:{min:0, max:5}
      },
    }
  },
  mounted() {
    this.renderd()
  },
  methods:
  { 
    renderd(mode="default"){
      let dmap = {
        FundraisingSupply: 0,
        TotalSupply: 0,
        InvestorsMaxRatio: 100,
        AdvisorsRatio:100,
        PublicSaleRatio:0,
        Remaining:100,
        RemainingSupply:0

        

      }
      
      dmap.TotalSupply = 100 * this.fundraisingMap.InvestorsSupply / this.Input.Distribution.InvestorsShare


      dmap.InvestorsMaxRatio = this.dformat(100 * this.fundraisingMap.InvestorsSupply / this.fundraisingMap.TotalSupply,2) 

      if(this.Input.Distribution.InvestorsShare>dmap.InvestorsMaxRatio)
        {
          this.Input.Distribution.InvestorsShare = dmap.InvestorsMaxRatio
          this.renderd("final")
        }
      
      dmap.AdvisorsRatio = this.dformat( 100* this.fundraisingMap.AdvisorsSupply / dmap.TotalSupply,this.ratioDecimals)
      this.Render = dmap
      dmap.PublicSaleRatio = this.dformat( 100* this.fundraisingMap.PublicSaleSupply / dmap.TotalSupply,this.ratioDecimals)


      

      if(mode == "FoundersShare" || mode == "default"){
          this.Input.Distribution.FoundersSupply = dmap.TotalSupply * this.Input.Distribution.FoundersShare / 100
      }
      if(mode == "FoundersSupply"){
          this.Input.Distribution.FoundersShare = this.Input.Distribution.FoundersSupply / (dmap.TotalSupply/100)
      }   
      
      if(mode == "DevsShare" || mode == "default"){
          this.Input.Distribution.DevsSupply = dmap.TotalSupply * this.Input.Distribution.DevsShare / 100
      }
      if(mode == "DevsSupply"){
          this.Input.Distribution.DevsShare = this.Input.Distribution.DevsSupply / (dmap.TotalSupply/100)
      }    


      if(mode == "CEXListingShare" || mode == "default"){
          this.Input.Distribution.CEXListingSupply = dmap.TotalSupply * this.Input.Distribution.CEXListingShare / 100
      }
      if(mode == "CEXListingSupply" ){
          this.Input.Distribution.CEXListingShare = this.Input.Distribution.CEXListingSupply / (dmap.TotalSupply/100)
      } 
      if(mode == "DEXListingShare" || mode == "default"){
          this.Input.Distribution.DEXListingSupply = dmap.TotalSupply * this.Input.Distribution.DEXListingShare / 100
      }
      if(mode == "DEXListingSupply" ){
          this.Input.Distribution.DEXListingShare = this.Input.Distribution.DEXListingSupply / (dmap.TotalSupply/100)
      } 

      if(mode == "CommunityAirdropShare" || mode == "default"){
          this.Input.Distribution.CommunityAirdropSupply = dmap.TotalSupply * this.Input.Distribution.CommunityAirdropShare / 100
      }
      if(mode == "CommunityAirdropSupply"){
          this.Input.Distribution.CommunityAirdropShare = this.Input.Distribution.CommunityAirdropSupply / (dmap.TotalSupply/100)
      } 

      if(mode == "CommunityFarmingShare" || mode == "default"){
          this.Input.Distribution.CommunityFarmingSupply = dmap.TotalSupply * this.Input.Distribution.CommunityFarmingShare / 100
      }
      if(mode == "CommunityFarmingSupply"){
          this.Input.Distribution.CommunityFarmingShare = this.Input.Distribution.CommunityFarmingSupply / (dmap.TotalSupply/100)
      } 


      if(mode == "CommunityRewardsShare" || mode == "default"){
          this.Input.Distribution.CommunityRewardsSupply = dmap.TotalSupply * this.Input.Distribution.CommunityRewardsShare / 100
      }
      if(mode == "CommunityRewardsSupply"){
          this.Input.Distribution.CommunityRewardsShare = this.Input.Distribution.CommunityFarmingSupply / (dmap.TotalSupply/100)
      } 


      if(mode == "TreasuryDevelopmentShare" || mode == "default"){
          this.Input.Distribution.TreasuryDevelopmentSupply = dmap.TotalSupply * this.Input.Distribution.TreasuryDevelopmentShare / 100
      }
      if(mode == "TreasuryDevelopmentSupply"){
          this.Input.Distribution.TreasuryDevelopmentShare = this.Input.Distribution.TreasuryDevelopmentSupply / (dmap.TotalSupply/100)
      } 

      if(mode == "TreasuryMarketingShare" || mode == "default"){
          this.Input.Distribution.TreasuryMarketingSupply = dmap.TotalSupply * this.Input.Distribution.TreasuryMarketingShare / 100
      }
      if(mode == "TreasuryMarketingSupply"){
          this.Input.Distribution.TreasuryMarketingShare = this.Input.Distribution.TreasuryMarketingSupply / (dmap.TotalSupply/100)
      } 

      dmap.Remaining = 100 - dmap.PublicSaleRatio - dmap.AdvisorsRatio - this.Input.Distribution.InvestorsShare - this.Input.Distribution.DevsShare - this.Input.Distribution.FoundersShare - this.Input.Distribution.CEXListingShare - this.Input.Distribution.DEXListingShare - this.Input.Distribution.CommunityAirdropShare - this.Input.Distribution.CommunityFarmingShare - this.Input.Distribution.CommunityRewardsShare - this.Input.Distribution.TreasuryMarketingShare  - this.Input.Distribution.TreasuryDevelopmentShare 
      
      
      dmap.RemainingSupply = dmap.TotalSupply * dmap.Remaining / 100

      this.Render = dmap

      this.seriesAllocation=[]
      this.chartOptionsAllocation.labels = []
      this.seriesAllocation.reverse()
      this.chartOptionsAllocation.labels.reverse()

      this.seriesAllocation.push(this.fundraisingMap.InvestorsSupply+this.fundraisingMap.AdvisorsSupply + this.fundraisingMap.PublicSaleSupply) 
      this.chartOptionsAllocation.labels.push("Fundraising")

      this.seriesAllocation.push(this.Input.Distribution.DevsSupply+this.Input.Distribution.FoundersSupply) 
      this.chartOptionsAllocation.labels.push("Team")

      this.seriesAllocation.push(this.Input.Distribution.CEXListingSupply+this.Input.Distribution.DEXListingSupply) 
      this.chartOptionsAllocation.labels.push("Liquidity")


      this.seriesAllocation.push(this.Input.Distribution.CommunityAirdropSupply+this.Input.Distribution.CommunityFarmingSupply + this.Input.Distribution.CommunityRewardsSupply) 
      this.chartOptionsAllocation.labels.push("Community")

      this.seriesAllocation.push(this.Input.Distribution.TreasuryDevelopmentSupply+this.Input.Distribution.TreasuryMarketingSupply + this.Render.RemainingSupply) 
      this.chartOptionsAllocation.labels.push("Treasury")

      

      this.seriesDistribution=[]
      this.chartOptionsDistribution.labels = []
      this.seriesDistribution.reverse()
      this.chartOptionsDistribution.labels.reverse()

      this.seriesDistribution.push(this.fundraisingMap.InvestorsSupply) 
      this.chartOptionsDistribution.labels.push("Investors")

      this.seriesDistribution.push(this.Input.Distribution.DevsSupply+this.Input.Distribution.FoundersSupply) 
      this.chartOptionsDistribution.labels.push("Team")

      this.seriesDistribution.push(this.fundraisingMap.AdvisorsSupply ) 
      this.chartOptionsDistribution.labels.push("Advisors")


      this.seriesDistribution.push(this.Input.Distribution.CommunityAirdropSupply+this.Input.Distribution.CommunityFarmingSupply + this.Input.Distribution.CommunityRewardsSupply + this.fundraisingMap.PublicSaleSupply) 
      this.chartOptionsDistribution.labels.push("Community")

      this.seriesDistribution.push(this.Input.Distribution.TreasuryDevelopmentSupply+this.Input.Distribution.TreasuryMarketingSupply + this.Render.RemainingSupply + this.Input.Distribution.CEXListingSupply+this.Input.Distribution.DEXListingSupply) 
      this.chartOptionsDistribution.labels.push("Other")

      

      
      
    },
    dformat(value,dec){

      return (Math.round(value * 10**dec) / 10**dec).toFixed(dec)
    },
    addFundraisingRound(id){
      
      const sample = {
            FundsToRaise: 2000000,
            ROI: 2,
            Name: "Sample Round",
            Id: 0,
            LiquidityReserveRatio: 10,
            AdvisorReward: 2,
            IsInvestors: "true",
          }
      sample.Id = id
      this.Input.Fundraising.Rounds.push(sample)
      this.renderd()
      return this.Input.Fundraising.Rounds
    },
    deleteFundraisingRound(key){
      this.Input.Fundraising.Rounds.splice(key,1)
      this.renderd()
      return key
    },
    moveleftFundraisingRound(key){
      if(key>0){
        const buffer = this.Input.Fundraising.Rounds[key-1]
        this.Input.Fundraising.Rounds[key-1] = this.Input.Fundraising.Rounds[key]
        this.Input.Fundraising.Rounds[key] = buffer
        this.Input.Fundraising.Rounds.reverse().reverse()
      }
      this.renderd()
      return key
    },
    moverightFundraisingRound(key){
      if(key<(this.Input.Fundraising.Rounds.length-1)){
        const buffer = this.Input.Fundraising.Rounds[key+1]
        this.Input.Fundraising.Rounds[key+1] = this.Input.Fundraising.Rounds[key]
        this.Input.Fundraising.Rounds[key] = buffer
        this.Input.Fundraising.Rounds.reverse().reverse()
      }
      this.renderd()
      return key
    }
  },
  computed:
  {
    /*allocations() {
      let res = {
        Basic: {
          
          Listing:0,
          Team: 0,
          Founders: 0,


        }
      }
    },*/

    maxSupply(){
      return this.fundraisingMap.TotalSupply * 100 / this.Input.Distribution.FundraisingRatio
    },
    liqRes(){

      let res = 0
      for(let i=0; i<this.Input.Fundraising.Rounds.length; i++)
        res+=parseFloat(this.Input.Fundraising.Rounds[i].FundsToRaise * this.Input.Fundraising.Rounds[i].LiquidityReserveRatio / 100)
      return res
    },
    fundraisingTotal() {
      let sum = 0
      for(let i=0; i<this.Input.Fundraising.Rounds.length; i++)
        sum+=parseFloat(this.Input.Fundraising.Rounds[i].FundsToRaise)
      return sum
    },
    fundraisingMap() {
      const res = {
        TotalRaised: 0,
        AvgPrice: 0,
        AvgPricePerIssued: 0,
        GainersSupply:0,
        AdvisorsSupply:0,
        TotalSupply:0,
        InvestorsSupply:0,
        PublicSaleSupply:0,
        Rounds:[],
        RoundNumber:0,
        AdvisorsNetWorthA: 0,
        InvestorsNetWorthA: 0,
        PublicSaleNetWorthA: 0,
        AdvisorsNetWorthB: 0,
        InvestorsNetWorthB: 0,
        PublicSaleNetWorthB: 0,

      }
      

      for(let i=0; i<this.Input.Fundraising.Rounds.length;i++){
        const RoundTemplate = {
        Price:0,
        PricePerIssued:0,
        Supply:0,
        AdvisorSupply:0,
        TotalSupply:0,
        Raised:0,
        AdvisorNetWorth:0,
      }
        const Round = this.Input.Fundraising.Rounds[i]
        const RoundMap = RoundTemplate

        RoundMap.Raised = parseInt(Round.FundsToRaise)
        RoundMap.Price = parseFloat(this.Input.Listing.InitialPrice) / parseFloat(Round.ROI)
        RoundMap.Supply = RoundMap.Raised / RoundMap.Price
        RoundMap.AdvisorSupply = Math.round(RoundMap.Supply * Round.AdvisorReward / 100)
        RoundMap.TotalSupply = RoundMap.Supply + RoundMap.AdvisorSupply
        RoundMap.PricePerIssued = RoundMap.Raised / RoundMap.TotalSupply
        RoundMap.AdvisorNetWorth = RoundMap.AdvisorSupply * RoundMap.PricePerIssued
        
        res.TotalRaised += RoundMap.Raised
        res.GainersSupply += RoundMap.Supply
        res.AdvisorsSupply += RoundMap.AdvisorSupply
        if(Round.IsInvestors == "true"){
          res.InvestorsSupply += RoundMap.Supply
          res.InvestorsNetWorthA += RoundMap.Raised
        }
        else {
          res.PublicSaleSupply += RoundMap.Supply
          res.PublicSaleNetWorthA += RoundMap.Raised
        }
          

        res.TotalSupply += RoundMap.TotalSupply
        res.Rounds.push(RoundMap)
        res.RoundNumber++
        res.AdvisorsNetWorthA += RoundMap.AdvisorNetWorth
      }

     res.AvgPrice = res.TotalRaised / res.GainersSupply
     res.AvgPricePerIssued = res.TotalRaised / res.TotalSupply 
      
      res.AdvisorsNetWorthB =  parseFloat(this.Input.Listing.InitialPrice) * res.AdvisorsSupply
      res.InvestorsNetWorthB = parseFloat(this.Input.Listing.InitialPrice) * res.InvestorsSupply
      res.PublicSaleNetWorthB =  parseFloat(this.Input.Listing.InitialPrice) * res.PublicSaleSupply
      


      return res
    }
    
  }

}
</script>

