import React, {useState, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import ReactTooltip from "react-tooltip";
import NextgenSimpleModal from "../Modal/NextgenSimpleModal";
import {loadingIndicatorActions} from "../../../../store/LoadingIndicator/LoadingIndicatorSlice";
import {GetUserDetail} from "../../../../Services/getUserDetail";
import createUserService from "../../../../Services/updateCreateUsers";
import {handleServerError, redirect} from '../../../../utils/genericUtil';
import * as constants from "../../../../utils/constants";
import SelectFromList from "../SelectFromList";
import PaginationComponent from "../PaginationComponent";

const roleOptions = {
    "Hub_User": "Standard user",
    "Account_Case_Manager": "Account case manager",
    "Partner_Case_Manager": "Partner case manager"
};

const RegisterUser = (props) => {
    const {
        newAccountDescription,
        newUserId,
        newFirstName,
        newLastName,
        newRoleTitle,
        newStandardTooltip,
        newPcmTooltip,
        newAcmTooltip,
        newRoleDescription,
        newSubmitButton,
        newCancelButton,
        manageUsersLandingPath,
        userAccountTitle,
        userAccountDescription
    } = props;


    const [roles, setRoles] = useState(["Hub_User"]);
    const [selectedRoles, setSelectedRoles] = useState([]);
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);
    const [errorModalMessage, setErrorModalMessage] = useState({errorModalTitle: '', errorModalDescription: ''});
    const [isSuccessOpen, setIsSuccessOpen] = useState(false);
    const userInfoProps = useSelector((state) => state.userInfo.userInfoProps);
    const [optionsList, setOptionsList] = useState([]);
    const [formValues, setFormValues] = useState({
        email: '',
        firstName: '',
        lastName: ''
    });

    const [formErrors, setFormErrors] = useState({});
    const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
    const [touched, setTouched] = useState({});
    const [accountNames, setAccountNames] = useState([]);
    const [selectedAccounts, setSelectedAccounts] = useState([]);

    useEffect(() => {
        const userRoles = userInfoProps.userdata?.roles;
        const email = userInfoProps.userdata?.email;
        setRoles(userRoles);
        fetchUserDetail(email);
    }, [userInfoProps]);

    const fetchUserDetail = async (email) => {
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        try {
            const response = await GetUserDetail(email);
            const matchedRecords = response.records.filter(record => record.Contact.Email === email);
            if (matchedRecords.length > 0) {
                const availableAccounts = matchedRecords.map(record => ({
                    value: record.Account.Id,
                    label: record.Account.Name
                }));
                setOptionsList(availableAccounts);
            }
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
        } catch (error) {
            console.error('Error fetching user details:', error);
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
        }
    };

    useEffect(() => {
        const errors = {};
        if (!formValues.email) {
            errors.email = 'You must enter an email address';
        } else if (!/\S+@\S+\.\S+/.test(formValues.email)) {
            errors.email = 'Email is invalid';
        }
        if (!formValues.firstName) {
            errors.firstName = 'First name is required';
        }
        if (!formValues.lastName) {
            errors.lastName = 'Last name is required';
        }
        setFormErrors(errors);
        setIsSubmitDisabled(Object.keys(errors).length > 0);
    }, [formValues]);

    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormValues({
            ...formValues,
            [name]: value
        });
    };

    const handleBlur = (e) => {
        const {name} = e.target;
        setTouched({
            ...touched,
            [name]: true
        });
    };

    const handleRoleChange = (role) => {
        setSelectedRoles((prevRoles) =>
            prevRoles.includes(role)
                ? prevRoles.filter((r) => r !== role)
                : [...prevRoles, role]
        );
    };

    const handleSubmit = async () => {
        const newUser = {
            firstName: formValues.firstName,
            lastName: formValues.lastName,
            email: formValues.email,
            roles: ["Hub_User", ...selectedRoles],

        };
        dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: true}));
        try {
            let accountsToSelect = selectedAccounts;
            if (optionsList.length === 1) {
                accountsToSelect = optionsList;
            }
            const response = await createUserService(newUser, accountsToSelect.map(account => account.value), setErrorModalMessage, 30000);
            console.log("API Response:", response);
            if ((response?.compositeResponse[0]?.httpStatusCode === 200 && response?.compositeResponse[0]?.body?.records?.length > 0)) {
                dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
                setIsSuccessOpen(true);
            } else {
                showErrorModal(response);
            }


        } catch (error) {
            console.error("Error creating user:", error);
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));

        } finally {
            dispatch(loadingIndicatorActions.setLoadingIndicatorProps({isLoading: false}));
        }
    };

    const showErrorModal = (result) => {
        if (result?.compositeResponse[0]?.httpStatusCode === 400 || result?.compositeResponse[0]?.httpStatusCode === 200) {
            let err = {code: result?.compositeResponse[0]?.httpStatusCode};
            let errorModalConst = {errorModalTitleConst: '', errorModalDescriptionConst: ''};
            const errorFound = result?.compositeResponse.some(responseItem => {
                return responseItem?.body.some(bodyItem => {
                    if (bodyItem.errors) {
                        return bodyItem.errors.some(error => error.statusCode === "PROCESSING_HALTED")
                    }
                    return bodyItem.errorCode === "CANNOT_EXECUTE_FLOW_TRIGGER"
                })
            });

            if (errorFound) {
                errorModalConst.errorModalTitleConst = constants.API_ERROR_MODAL_TITLE
                errorModalConst.errorModalDescriptionConst = constants.API_ERROR_MODAL_CLOSED_CASE_VALIDATION_ERROR
            } else {
                errorModalConst = handleServerError(err, errorModalConst);
            }
            setErrorModalMessage({
                errorModalTitle: errorModalConst.errorModalTitleConst,
                errorModalDescription: errorModalConst.errorModalDescriptionConst
            });
        }
    }


    return (

        <div className="registerUser container" role="form" aria-labelledby="Register new user">
            <p className="description" id="newAccountDescription">{newAccountDescription}</p>

            <div className="form-group">
                <label
                    className={(touched.email && formErrors.email) ? "error-message" : "form__label"}
                    htmlFor="emailInput"
                >{newUserId} *</label>
                <input
                    type="email"
                    name="email"
                    id="emailInput"
                    className={(touched.email && formErrors.email) ? "error-border" : "input"}
                    placeholder="john.smith@optum.com"
                    value={formValues.email}
                    onChange={handleInputChange}
                    onBlur={handleBlur}
                    aria-required="true"
                    aria-invalid={!!formErrors.email}
                    aria-describedby="emailError"
                />
                {touched.email && formErrors.email && <p className="error-message" id="emailError">{formErrors.email}</p>}
            </div>

            <div className="form__fieldset">
                <div className="form-group">
                    <label
                        className={(touched.firstName && formErrors.firstName) ? "error-message" : "form__label"}
                        htmlFor="firstNameInput"
                    >{newFirstName} *</label>
                    <input
                        type="text"
                        name="firstName"
                        id="firstNameInput"
                        className={(touched.firstName && formErrors.firstName) ? "error-border" : "input"}
                        placeholder="John"
                        value={formValues.firstName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={!!formErrors.firstName}
                        aria-describedby="firstNameError"
                    />
                    {touched.firstName && formErrors.firstName && <p className="error-message" id="firstNameError">{formErrors.firstName}</p>}
                </div>
                <div className="form-group">
                    <label
                        className={(touched.lastName && formErrors.lastName) ? "error-message" : "form__label"}
                        htmlFor="lastNameInput"
                    >{newLastName} *</label>
                    <input
                        type="text"
                        name="lastName"
                        id="lastNameInput"
                        className={(touched.lastName && formErrors.lastName) ? "error-border" : "input"}
                        placeholder="Smith"
                        value={formValues.lastName}
                        onChange={handleInputChange}
                        onBlur={handleBlur}
                        aria-required="true"
                        aria-invalid={!!formErrors.lastName}
                        aria-describedby="lastNameError"
                    />
                    {touched.lastName && formErrors.lastName && <p className="error-message" id="lastNameError">{formErrors.lastName}</p>}
                </div>
            </div>
            <hr/>
            <div className={"user-role-section"} role="group" aria-labelledby="userRoleSectionTitle">
                <div className={"checkbox-section-title"} id="userRoleSectionTitle">{newRoleTitle}</div>
                <div className={"checkbox-section-subtitle"}>{newRoleDescription}</div>
                <div className={"checkbox-section"}>
                    {console.log(roles, 'dummyData')}
                    {Object.keys(roleOptions)
                        .filter((role) => roles?.includes(role))
                        .map((role) => (
                            <div key={role}>
                                <input
                                    type="checkbox"
                                    checked={selectedRoles?.includes(role) || role === "Hub_User"}
                                    disabled={role === "Hub_User"}
                                    className={role === "Hub_User" ? 'disabledGray' : ''}
                                    onChange={() => handleRoleChange(role)}
                                    aria-labelledby={`${role}-label`}
                                    aria-describedby={`${role}-tooltip`}
                                /> {roleOptions[role]}
                            <span style={{marginLeft: '5px'}}>
                                <i className="iconCircleInfo" data-tip data-for={`${role}-tooltip`}
                                   aria-hidden="true"></i>
                            </span>
                            <ReactTooltip
                                id={`${role}-tooltip`}
                                place="top"
                                backgroundColor="#001D5B"
                                arrowColor="#001D5B"
                                textColor="#fff"
                                borderColor="001D5B"
                                multiline={true}
                                className="opt_tooltip"
                            >
                                {role === "Hub_User" ? newStandardTooltip : role === "Account_Case_Manager" ? newAcmTooltip : newPcmTooltip}
                            </ReactTooltip>
                        </div>
                    ))}
                </div>
            </div>
            <hr/>

            {optionsList.length > 1 &&
            <div className="account-select">
                <div className="account-title">{userAccountTitle}</div>
                <p className="account-description">{userAccountDescription}</p>
            </div>
            }
            <SelectFromList
                assignedAccountsList={selectedAccounts}
                setAssignedAccountsList={setSelectedAccounts}
                optionsList={optionsList}
            />
            <div className="form-group">
                <div className="button-group">
                    <button className="submit-btn" disabled={isSubmitDisabled}
                            onClick={handleSubmit} aria-label="Submit">{newSubmitButton}</button>
                    <button className="cancel-btn" onClick={() => setIsOpen(true)}
                            aria-label="Cancel">{newCancelButton}</button>
                </div>
            </div>
            {isOpen && (
                <NextgenSimpleModal
                    OnCloseModalCall={() => setIsOpen(false)}
                    hideCloseIcon={false}
                    isRegisterUserModal={true}
                    title={"Are you sure you want to cancel? "}
                    body={<div className={"cancel-modal-body"}>Canceling now will discard the information you've entered
                        and stop the case from being created. </div>}
                    buttonText={"Cancel and do not save"}
                    cancelBtnText={"Continue editing"}
                    isOpen={isOpen}
                    setIsOpen={setIsOpen}
                    HandleButtonClick={() => redirect("internal", manageUsersLandingPath)}
                    isCaseCloseModal={false}
                />
            )}

            {isSuccessOpen && (
                <NextgenSimpleModal
                    OnCloseModalCall={() => setIsSuccessOpen(false)}
                    hideCloseIcon={false}
                    isRegisterUserModal={true}
                    title={"New user request submission successfully"}
                    body={<div className={"cancel-modal-body"}>The new user has been submitted successfully.</div>}
                    buttonText={"OK"}
                    isOpen={isSuccessOpen}
                    setIsOpen={setIsSuccessOpen}
                    HandleButtonClick={() => redirect("internal", manageUsersLandingPath)}
                    // HandleButtonClick={() => setIsSuccessOpen(false)}
                    isCaseCloseModal={false}
                />
            )}

            {errorModalMessage.errorModalTitle && (
                <NextgenSimpleModal
                    OnCloseModalCall={() => setErrorModalMessage({errorModalTitle: '', errorModalDescription: ''})}
                    hideCloseIcon={false}
                    isRegisterUserModal={true}
                    title={errorModalMessage.errorModalTitle}
                    body={<div className={"cancel-modal-body"}>{errorModalMessage.errorModalDescription}</div>}
                    buttonText={"OK"}
                    isOpen={!!errorModalMessage.errorModalTitle}
                    setIsOpen={() => setErrorModalMessage({errorModalTitle: '', errorModalDescription: ''})}
                    HandleButtonClick={() => setErrorModalMessage({errorModalTitle: '', errorModalDescription: ''})}
                    isCaseCloseModal={false}
                />
            )}
            {selectedAccounts.length > 0 && (
                <PaginationComponent
                    totalItems={selectedAccounts.length}
                    itemsPerPage={10}
                    currentPage={1}
                    onPageChange={(page) => console.log(`Page changed to: ${page}`)}
                />
            )}
        </div>
    );
}

export default RegisterUser;
