Bugs, fixes:

Pragma solidity without ^ mark.
IMO mapping balance to uint248 is redundant and it makes code less readable. If I have missed some usages of converting balance to uint248 (i.e bytecode related topic or other that I have missed) then sorry for that ;)
Lack of event about deposing ether.
Lack of event about withdrawing ether.
Emit logs about deposit and withdraw ether.
Although piggyBank function uses msg.value, it is not payable.
Not specified visibility in functions.
keccak256(arg1, arg2) should wrap arguments inside keccak256(abi.encodePacked(arg1, arg2))
Instead of  if (msg.sender != owner) revert(); I think it should be: require(msg.sender == owner, “Only owner”);
Instead of  if (keccak256(owner, password) != hashedPassword) revert(); I think it should be: require(keccak256(abi.encodePacked(owner, pasword) == hashedPassword, “wrong password”); 
Variables should have public access to have an easier access to their values.
Any contract is able to call constructor method, solution for it is to use constructor instead of function like this: constructor () public payable {         owner = msg.sender;         balance += uint248(msg.value) }
After creating such constructor function piggyBank() should be renamed to deposit()
If we add modifier onlyIfOwner to kill function and fallback function, password variable and parameter in contract is redundant. We could only rely on modifier   modifier onlyIfOwner {   require(msg.sender == owner, “Only an owner has an access”);   _; } and removing from contract a) param _hashedPassword from piggyBank function b) variable hashedPassword c) param password from kill function
 Execution of kill function should be restricted to an authorized user, or user with some privileges
 If contract has a functionality that receives ether, it must allow users to withdraw this deposited ether from the contract. 


     2) Bugs, fixes: 

Missing event for shipping
Missing emitting Event for shipping
Missing payable keyword in function purchase()
wallet.send doesn’t verify if sending ether goes successfully, we can do it by check if send goes successfully and throws if it doesn’t, but I’d prefer to use transfer, as it check for us and makes code more readable. This step is required to check if funds are being handled safely.
No matter if we stick to send or transfer, it should be placed as a last operation in purchase method
In Solidity 0.4.5 interfaces were not available, therefore we should upgrade Solidity to newer version or get rid of interfaces with indication of changing version of solidity. 
ship() function should be external.
purchase() function should be public.
Change function Store(address _wallet, address _warehouse) to constructor(address _wallet, address _warehouse)


3) Bugs, fixes:

Upgrade solidity to ^0.4.24
function Splitter(address _two) should be renamed to constructor(address _two)
Same function should have payable keyword in name if it uses msg.value
And defined visibility, in that case public
Fallback function should have defined visibility keyword (public)
Instead of if (msg.value > 0) revert(); it should be require(msg.value < 0, “No ether allowed”);
This contract doesn’t handle modulo of dividing contract balance by 3, one of solutions is to store it in contract or refund.
It would be better to store addresses in address array (address[2] recipients)
Instead of working on `one` and `two` variable, we can work on mentioned above address array.
Instead of sending ether to both recipients, each of recipient balance should be stored and allow them to claim balance manually. In other case, if first recipient reject payment then contract would stop execution, therefore second recipient won’t get paid. Fallback function wrongly assume that recipient isn’t contract. 
 The target of a call instruction is vulnerable for attacker’s manipulation. Right now this contract allows an user to execute untrusted code on behalf of the contract.
 Fallback function execution should be somehow restricted to an authorized set of users.


