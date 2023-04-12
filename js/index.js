$( document ).ready(function() {
    connectMe('metamask_wallet');
    loadInitialData('sevenDays');
});

function showHideBtns(_btn_id, _to_show) {
    if(_to_show) {
        $(_btn_id).prop('disabled', false);
        // $(_btn_id).show();
        $(_btn_id).find('span:first').html('Connect');
    } else {
        $(_btn_id).prop('disabled', true);
        // $(_btn_id).hide();
        $(_btn_id).find('span:first').html('Processing...');
    }
}

function showHideBtnsVal(_btn_id, _to_show) {
    if(_to_show) {
        $(_btn_id).prop('disabled', false);
        $(_btn_id).val($(_btn_id).attr('name'));
    } else {
        $(_btn_id).prop('disabled', true);
        $(_btn_id).val('Processing...');
    }
}

// $('#metamask_wallet').on('click', function() {
//     connectMe('metamask_wallet');
// });

$('.stake-tab-links').on('click', function() {
    let sel = $(this).attr('name');
    loadInitialData(sel);
})

async function loadInitialData(sClass) {
    try {
        $('.wallet-connected-block').hide();
        clearInterval(countDownGlobal);
        $('.countdown-time').html('');
        $('.countdown-block').hide();

        $('.initial-loader').html(`
            <div class="spinner-border spinner-border" role="status">
                <span class="sr-only">Loading...</span>
            </div>
        `);

        let cObj = new web3Main.eth.Contract(_CONTRACT_DATA[_NETWORK_ID].STACKING.abi, _CONTRACT_DATA[_NETWORK_ID].STACKING[sClass].address);

        let totalLockedTokens = await cObj.methods.getTotalStakedTokens().call();

        console.log('totalLockedTokens', totalLockedTokens);

        $('#total-locked-tokens').html(`${totalLockedTokens / 10**18} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`);

        let totalUsers = await cObj.methods.getTotalUsers().call();

        console.log('totalUsers', totalUsers);
        
        $('#num-of-stackers').html(totalUsers);

        let earlyUnstakeFee = await cObj.methods.getEarlyUnstakeFeePercentage().call();

        console.log('earlyUnstakeFee', earlyUnstakeFee);

        $(`#${sClass} .early-unstake-fee`).html(`${earlyUnstakeFee / 100}%`);

        let minStakeAmount = await cObj.methods.getMinimumStakingAmount().call();
        minStakeAmount = Number(minStakeAmount);

        console.log('minStakeAmount', minStakeAmount);

        let minA;

        if(minStakeAmount) {
            minA = `${(minStakeAmount / 10 ** 18).toLocaleString()} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`;

        } else {
            minA = 'N/A';
        }

        $(`#${sClass} .min-stake-amount`).html(minA);
        $(`#${sClass} .max-stake-amount`).html(`${(15000000).toLocaleString()} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`);

        let isStakingPaused = await cObj.methods.getStakingStatus().call();
        let isStakingPausedText;

        console.log('isStakingPaused', isStakingPaused);

        let startDate = await cObj.methods.getStakeStartDate().call();
        startDate = Number(startDate) * 1000;        
        console.log('startDate', startDate);

        let endDate = await cObj.methods.getStakeEndDate().call();
        endDate = Number(endDate) * 1000;
        console.log('endDate', endDate);

        let currentDate = new Date().getTime();
        console.log('currentDate', currentDate);

        if(isStakingPaused) {
            isStakingPausedText = 'Paused';
        } else if(currentDate < startDate) {
            isStakingPausedText = 'Locked';
        } else if(currentDate > endDate) {
            isStakingPausedText = 'Ended';
        } else {
            isStakingPausedText = 'Active';
        }

        $(`#${sClass} .current-staking-status`).html(isStakingPausedText);

        if(currentDate > startDate && currentDate < endDate) {
            let ele = $('.countdown-time');
            generateCountDown(ele, endDate);

            $('.countdown-block .countdown-title').html('Staking Ends In');
            $('.countdown-block').show();
        }

        if(currentDate < startDate) {
            let ele = $('.countdown-time');
            generateCountDown(ele, startDate);

            $('.countdown-block .countdown-title').html('Staking Starts In');
            $('.countdown-block').show();
        }

        if(currentDate > endDate || isStakingPaused) {
            $('.stake-btn-block').hide();
        } else {
            $('.stake-btn-block').show();
        }

        // let cApy = await cObj.methods.getAPY().call();

        // console.log('cApy', cApy);
        
        // $(`#${sClass} .apy`).html(`${cApy / 100} %`);

        if(isMetamaskConnected) {

            console.log('adadadadadadadas',  isStakingPaused)

            if(((currentDate > startDate && currentDate < endDate) || currentDate > endDate)) {
                $('.wallet-connected-block').show();
            }

            refreshBal(sClass);
            getTxhistory(sClass);
        }
    } catch (error) {
        console.log(error);
        notyf.error(`Unable to fetch data from ${_CONTRACT_DATA[_NETWORK_ID].network_name}!\n Please refersh this page.`);
    }
}

function generateCountDown(ele, claimDate) {
    clearInterval(countDownGlobal);
    // Set the date we're counting down to
    var countDownDate = new Date(claimDate).getTime();

    // Update the count down every 1 second
    countDownGlobal = setInterval(function() {

        // Get today's date and time
        var now = new Date().getTime();
    
        // Find the distance between now and the count down date
        var distance = countDownDate - now;
    
        // Time calculations for days, hours, minutes and seconds
        var days = Math.floor(distance / (1000 * 60 * 60 * 24));
        var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
    
        // Display the result in the element with id="demo"
        ele.html(days + "d " + hours + "h " + minutes + "m " + seconds + "s ");
    
        // If the count down is finished, write some text
        if (distance < 0) {
            clearInterval(countDownGlobal);
            ele.html("Refresh Page");
        }
    }, 1000);
}

async function connectMe(_provider) {
    try {
        console.log('-> connecting: ', _provider);

        showHideBtns('#connect-metamask', false);

        let _comn_res = await commonProviderDetector(_provider);

        console.log('_comn_res', _comn_res);

        if(!_comn_res) {
            showHideBtns('#connect-metamask',true);
        } else {
            isMetamaskConnected = true;

            $('#selected-address').html(`Address: ${selectedAccount}`);

            let sClass = getSelectedTab();
            // refreshBal(sClass);
            // getTxhistory(sClass);
            loadInitialData(sClass);

            $('#connect-block').hide();

            $('#current-nentwork').html(_CONTRACT_DATA[_NETWORK_ID].network_name);
            $('#addr').val(selectedAccount);
            $('.metamask-connected-block').show();
        }
    } catch (error) {
        showHideBtns('#connect-metamask', true);
        console.log('catch');
        console.log(error);
        notyf.error(error.message);
        // alert(error.toString());
    }
}


async function stackTokens() {
    try {
        let nTokens = $('#amount-to-stack').val();

        if(!nTokens) {
            return;
        }

        if(isNaN(nTokens) || nTokens == 0 || Number(nTokens) < 0) {
            console.log(`Invalid token amount!`);
            return;
        }

        // let notification = notyf.success({
        //     duration: 3000000,
        //     message: 'Initiating deposit...'
        // });

        // enableDisableBtns(false);

        nTokens = Number(nTokens);

        let tokenToTransfer = addDecimal(nTokens, 18);
        // let tokenToTransfer = (nTokens) * 10 ** _CONTRACT_DATA[_NETWORK_ID].ERC20_MTNK.decimals;
        // tokenToTransfer = tokenToTransfer.toString();

        console.log('tokenToTransfer', tokenToTransfer);

        showHideBtnsVal('#stake-btn', false);

        let balMainUser = await oContractToken.methods.balanceOf(selectedAccount).call();

        balMainUser = Number(balMainUser) / (10 ** 18);

        console.log('balMainUser', balMainUser);

        if(balMainUser  < (nTokens)) {
            // enableDisableBtns(true);
            // notyf.dismiss(notification);
            showHideBtnsVal('#stake-btn', true);
            notyf.error(`insufficient tokens on ${_CONTRACT_DATA[_NETWORK_ID].network_name}.\nPlease buy some tokens first!`);
            return;
        }

        let sClass = getSelectedTab();
        let balMainAllowance = await oContractToken.methods.allowance(selectedAccount, _CONTRACT_DATA[_NETWORK_ID].STACKING[sClass].address).call();

        console.log('balMainAllowance', balMainAllowance);

        if(Number(balMainAllowance) < Number(tokenToTransfer)) {
            approveTokenSpend(tokenToTransfer, sClass);
        } else {
            stackTokenMain(tokenToTransfer, sClass);
        }

    } catch (error) {
        // enableDisableBtns(true);
        showHideBtnsVal('#stake-btn', true);
        console.log(error);
        // notyf.dismiss(notification);
        notyf.error(formatEthErrorMsg(error));
    }
}

async function approveTokenSpend(_mint_fee_wei, sClass) {
    let gasEstimation;

    try {
        gasEstimation = await oContractToken.methods.approve(_CONTRACT_DATA[_NETWORK_ID].STACKING[sClass].address, _mint_fee_wei).estimateGas({
            from: selectedAccount
        });
        console.log('gasEstimation', gasEstimation);
    } catch (error) {
        console.log(error);
        showHideBtnsVal('#stake-btn', true);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractToken.methods.approve(_CONTRACT_DATA[_NETWORK_ID].STACKING[sClass].address, _mint_fee_wei)
        .send({
            from: selectedAccount,
            gas: gasEstimation
        })
        .on('transactionHash', (hash) => {
            console.log("Transaction Hash: ", hash);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
            stackTokenMain(_mint_fee_wei, sClass);
        })
        .catch((error) => {
            console.log(error);
            notyf.error(formatEthErrorMsg(error));
            showHideBtnsVal('#stake-btn', true);
            return;
        });
}

async function stackTokenMain(_amount_wei, sClass) {
    let gasEstimation;

    let oContractStacking = getContractObj(sClass);

    try {
        gasEstimation = await oContractStacking.methods.stake(_amount_wei).estimateGas({
            from: selectedAccount
        });
        console.log('gasEstimation', gasEstimation);
    } catch (error) {
        console.log(error);
        notyf.error(formatEthErrorMsg(error));
        showHideBtnsVal('#stake-btn', true);
        return;
    }

    oContractStacking.methods.stake(_amount_wei)
        .send({
            from: selectedAccount,
            gas: gasEstimation
        })
        .on('transactionHash', (hash) => {
            console.log("Transaction Hash: ", hash);
        })
        .on('receipt', (receipt) => {
            $('#amount-to-stack').val('');
            console.log(receipt);
            showHideBtnsVal('#stake-btn', true);
            // refreshBal(sClass);
            loadInitialData(sClass);
        })
        .catch((error) => {
            console.log(error);
            showHideBtnsVal('#stake-btn', true);
            notyf.error(formatEthErrorMsg(error));
            return;
        });
}

async function unstackTokens() {
    try {
        let nTokens = $('#amount-to-unstack').val();

        if(!nTokens) {
            return;
        }

        if(isNaN(nTokens) || nTokens == 0 || Number(nTokens) < 0) {
            console.log(`Invalid token amount!`);
            return;
        }

        // let notification = notyf.success({
        //     duration: 3000000,
        //     message: 'Initiating deposit...'
        // });

        // enableDisableBtns(false);

        nTokens = Number(nTokens);

        let tokenToTransfer = addDecimal(nTokens, 18);
        // let tokenToTransfer = (nTokens) * 10 ** _CONTRACT_DATA[_NETWORK_ID].ERC20_MTNK.decimals;
        // tokenToTransfer = tokenToTransfer.toString();

        console.log('tokenToTransfer', tokenToTransfer);

        showHideBtnsVal('#unstake-btn', false);

        let sClass = getSelectedTab();
        let oContractStacking = getContractObj(sClass);

        let balMainUser = await oContractStacking.methods.getUser(selectedAccount).call();

        balMainUser = Number(balMainUser.stakeAmount) / (10 ** 18);

        console.log('balMainUser', balMainUser);

        if(balMainUser  < (nTokens)) {
            // enableDisableBtns(true);
            // notyf.dismiss(notification);
            showHideBtnsVal('#unstake-btn', true);
            notyf.error(`insufficient staked tokens on ${_CONTRACT_DATA[_NETWORK_ID].network_name}!`);
            return;
        }

        unstackTokenMain(tokenToTransfer, oContractStacking, sClass);

    } catch (error) {
        // enableDisableBtns(true);
        console.log(error);
        // notyf.dismiss(notification);

        showHideBtnsVal('#unstake-btn', true);
        notyf.error(formatEthErrorMsg(error));
    }
}

async function unstackTokenMain(_amount_wei, oContractStacking, sClass) {
    let gasEstimation;

    try {
        gasEstimation = await oContractStacking.methods.unstake(_amount_wei).estimateGas({
            from: selectedAccount
        });
        console.log('gasEstimation', gasEstimation);
    } catch (error) {
        console.log(error);

        showHideBtnsVal('#unstake-btn', true);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractStacking.methods.unstake(_amount_wei)
        .send({
            from: selectedAccount,
            gas: gasEstimation
        })
        .on('transactionHash', (hash) => {
            console.log("Transaction Hash: ", hash);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
            $('#amount-to-unstack').val('');
            // refreshBal(sClass);
            loadInitialData(sClass);

            showHideBtnsVal('#unstake-btn', true);
            // $('#recruit-now').modal('hide');
            // loadCongratsModal(receipt);
        })
        .catch((error) => {
            console.log(error);

            showHideBtnsVal('#unstake-btn', true);
            notyf.error(formatEthErrorMsg(error));
            // showHideModalBtns('recruit-btn', true);
            return;
        });
}

async function claimTokens() {
    try {
        showHideBtnsVal('#claim-btn', false);

        let sClass = getSelectedTab();
        let oContractStacking = getContractObj(sClass);

        let rewardBal = await oContractStacking.methods.getUserEstimatedRewards().call({ from: selectedAccount});
        rewardBal = Number(rewardBal);

        console.log('rewardBal', rewardBal);

        if(!rewardBal) {
            // enableDisableBtns(true);
            // notyf.dismiss(notification);
            showHideBtnsVal('#claim-btn', true);
            notyf.error(`insufficient reward tokens to claim!`);
            return;
        }

        claimTokenMain(oContractStacking, sClass);

    } catch (error) {
        // enableDisableBtns(true);
        console.log(error);
        // notyf.dismiss(notification);

        showHideBtnsVal('#claim-btn', true);
        notyf.error(formatEthErrorMsg(error));
    }
}

async function claimTokenMain(oContractStacking, sClass) {
    let gasEstimation;

    try {
        gasEstimation = await oContractStacking.methods.claimReward().estimateGas({
            from: selectedAccount
        });
        console.log('gasEstimation', gasEstimation);
    } catch (error) {
        console.log(error);

        showHideBtnsVal('#claim-btn', true);
        notyf.error(formatEthErrorMsg(error));
        return;
    }

    oContractStacking.methods.claimReward()
        .send({
            from: selectedAccount,
            gas: gasEstimation
        })
        .on('transactionHash', (hash) => {
            console.log("Transaction Hash: ", hash);
        })
        .on('receipt', (receipt) => {
            console.log(receipt);
            // refreshBal(sClass);
            loadInitialData(sClass);

            showHideBtnsVal('#claim-btn', true);
            // $('#recruit-now').modal('hide');
            // loadCongratsModal(receipt);
        })
        .catch((error) => {
            console.log(error);

            showHideBtnsVal('#claim-btn', true);
            notyf.error(formatEthErrorMsg(error));
            // showHideModalBtns('recruit-btn', true);
            return;
        });
}

async function refreshBal(sClass) {
    $('.refresh-loader').html(`
        <div class="spinner-border spinner-border" role="status">
            <span class="sr-only">Loading...</span>
        </div>
    `);
    let nBalMain = await oContractToken.methods.balanceOf(selectedAccount).call();

    console.log('nBalMain', nBalMain);

    let nBalMainW = nBalMain / 10**18;

    $('#user-main-balance').attr('bal', nBalMainW).html(`Balance: ${nBalMainW} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`);

    let oContractStacking = getContractObj(sClass);

    let nBalStack = await oContractStacking.methods.getUser(selectedAccount).call();

    console.log('nBalStack', nBalStack.stakeAmount);

    let nBalStackW = nBalStack.stakeAmount / 10**18;

    $('#user-staked-balance').attr('bal', nBalStackW).html(`${nBalStackW} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`);

    let rewardBal = await oContractStacking.methods.getUserEstimatedRewards().call({ from: selectedAccount});

    console.log('rewardBal', rewardBal);

    $('#user-reward-balance').html(`Reward: ${rewardBal / 10 ** 18} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`);
}

async function getTxhistory(sClass) {
    try {
        $('#tx-history-body tbody').html(`
            <tr>
                <td></td>
                <td></td>
                <td></td>
                <td>
                    <div class="spinner-border spinner-border" role="status">
                        <span class="sr-only">Loading...</span>
                    </div>
                </td>
                <td></td>
                <td></td>
                <td></td>
            </tr>
        `);

        console.log('in tx history')
        let stakingContractAddress = _CONTRACT_DATA[_NETWORK_ID].STACKING[sClass].address;
        
        let data = {
            "from_address": selectedAccount,
            "to_address": stakingContractAddress,
            "nLimit": 100,
            "nStart": 0
        };

        // console.log(data)

        let res = await call_api(`${_API_URL}/staking/list`, 'POST', JSON.stringify(data));

        // console.log(res);

        $('#tx-history-body tbody').html('');

        if(res.length) {
            for(let i=0; i<res.length; i++) {
                let transaction_hash = res[i].transaction_hash;
                var firstLet = transaction_hash.slice(0, 7);
                var lastLet = transaction_hash.slice(
                    selectedAccount.length - 7,
                    selectedAccount.length
                );

                let fee = `${res[i].fee} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}`;

                if(!res[i].fee) {
                    fee = '-';
                }

                $('#tx-history-body tbody').append(`
                    <tr>
                        <td>${i + 1}</td>
                        <td>${res[i].transaction_type}</td>
                        <td>${new Date(res[i].transaction_time).toLocaleString()}</td>
                        <td>${fee}</td>
                        <td>${res[i].amount} ${_CONTRACT_DATA[_NETWORK_ID].TOKEN.symbol}</td>
                        <td>${res[i].status}</td>
                        <td style="justify-content: center !important;"><a href="${_CONTRACT_DATA[_NETWORK_ID].explorer_url}/${res[i].transaction_hash}"><i class="fa fa-external-link h6" aria-hidden="true"></i></a></td>
                    </tr>
                `);
            }
        } else {
            $('#tx-history-body tbody').append(`
                <tr>
                <td></td>
                <td></td>
                <td></td>
                <td style="text-align: center !important;">No data available</td>
                <td></td>
                <td></td>
                <td></td>
              </tr>
               `);
        
        }
        $('#tx-history').show();
    } catch(e) {
        console.log(e);
        notyf.error(`Unable to fetch data from!\n Please refersh this page & try again.`);
    }
}

$('.max-stake').on('click', function() {
    let val = parseFloat($('#user-main-balance').attr('bal'));

    if(!isNaN(val) && val != 0) {
        console.log(val)
        $('#amount-to-stack').val(val);
    }
});

$('.max-unstake').on('click', function() {
    let val = parseFloat($('#user-staked-balance').attr('bal'));

    if(!isNaN(val) && val != 0) {
        $('#amount-to-unstack').val(val);
    }
});