pragma solidity ^0.4.24;

import "./Owned.sol";
import "./TollBoothHolder.sol";
import "./interfaces/RoutePriceHolderI.sol";


contract RoutePriceHolder is TollBoothHolder, RoutePriceHolderI {

    mapping (bytes32 => uint) internal priceHolders;
    
    event LogRoutePriceSet(address indexed sender, address indexed entryBooth, address indexed exitBooth, uint priceWeis);

    constructor() public {}

    function setRoutePrice(address _entryBooth, address _exitBooth, uint _priceWeis) public fromOwner returns(bool success) {
        require(_entryBooth != _exitBooth, "An entry booth and exit booth cannot be the same!");
        require(_entryBooth > 0x0 && _exitBooth > 0x0, "Either booths is a 0x address.");
        require(isTollBooth(_entryBooth) && isTollBooth(_exitBooth), "Entry booth and exit booth must be toll!");
        bytes32 addressesHashed = keccak256(abi.encodePacked(_entryBooth, _exitBooth));
        require(priceHolders[addressesHashed] != _priceWeis, "There must a change in price");
        priceHolders[addressesHashed] = _priceWeis;
        emit LogRoutePriceSet(msg.sender, _entryBooth, _exitBooth, _priceWeis);
        return true;
    }

    function getRoutePrice(address _entryBooth, address _exitBooth) public view returns(uint priceWeis) {
        return priceHolders[keccak256(abi.encodePacked(_entryBooth, _exitBooth))];
    }
}
