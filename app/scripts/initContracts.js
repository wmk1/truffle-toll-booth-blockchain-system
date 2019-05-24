import regulatorArtifacts from '../../build/contracts/Regulator.json'
import tollBoothOperatorArtifacts from '../../build/contracts/TollBoothOperator.json'


let Regulator = contract(regulatorArtifacts)
let TollBoothOperator = contract(tollBoothOperatorArtifacts)
let TollBoothHolder = contract(tollBoothHolderArtifacts)

let initContracts = async () => {
  
}

export default initContracts