S.add('dog1', {
	name: 'Fred',
	speech: 'bark',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.add('dog2', {
	name: 'Jim',
	speech: 'bark',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.add('isCool', true);

S.add('today', new Date);

S.add('human', {
	name: 'Jake',
	handedness: 'right',
	speech: 'WORDS',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.add({
	name: 'Tyler',
	speech: 'bark',
	speak: function(what){
		console.log(this.name, 'says', what, 'with his', this.speech);
	}
});

S.add('lottery', [2, 4, 16, 256, 65536]);

S.add({
	"header": {
		"class": "com.nationwide.schemas.soasolutions.systeminfo_4.CommandResponseBase",
		"systemInfo": {
			"any": [],
			"class": "com.nationwide.schemas.soasolutions.systeminfo_4.SystemInfoResponse",
			"functionMode": null,
			"retrievalLevel": null,
			"returnInfo": [{
				"class": "com.nationwide.schemas.soasolutions.systeminfo_4.ReturnInfo",
				"commonReturnCode": null,
				"commonReturnMessage": null,
				"providerReturnInfo": [],
				"returnSeverity": {
					"enumType": "com.nationwide.schemas.soasolutions.systeminfo_4.SeverityType",
					"name": "SUCCESSFUL"
				},
				"returnSource": null,
				"returnSourceCategory": null,
				"returnState": null
			}],
			"serviceContext": {
				"class": "com.nationwide.schemas.soasolutions.systeminfo_4.ServiceContext",
				"destinationEnvironment": null,
				"destinationLogicalId": null,
				"sourceLogicalId": null,
				"transactionId": "?"
			}
		}
	},
	"body": {
		"asOfDt": {
			"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Date",
			"value": "2011-02-17"
		},
		"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.ProgramRiskClassInqRsType",
		"riskClassInfo": {
			"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.RiskClassInfoType",
			"commlPropertyInfo": [{
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.CommlPropertyInfoType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "0311"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Up to 10 units—Apartments without Mercantile occupancies"
				},
				"programClassID": "82917",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.CommlPropertyInfoType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "0312"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "11 to 30 units—Apartments without Mercantile occupancies"
				},
				"programClassID": "917303",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.CommlPropertyInfoType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "0313"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Over 30 units—Apartments without Mercantile occupancies"
				},
				"programClassID": "1916320",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.CommlPropertyInfoType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "0321"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Up to 10 units—Apartments with Mercantile occupancies"
				},
				"programClassID": "1838471",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.CommlPropertyInfoType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "0322"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "11 to 30 units—Apartments with Mercantile occupancies"
				},
				"programClassID": "91239",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.CommlPropertyInfoType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "0323"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Over 30 units—Apartments with Mercantile occupancies"
				},
				"programClassID": "1278892",
				"secondaryClassCd": null
			}],
			"generalLiabilityClassificationReference": [{
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.GeneralLiabilityClassificationReferenceType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "60010"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Apartment Buildings—Products/Completed Operations are subject to the General Aggregate limit"
				},
				"limit": [{
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 200000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 100000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 827293,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 600000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 300000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 981863,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 500000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 165392,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 2000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 62839,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}],
				"programClassID": "512331",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.GeneralLiabilityClassificationReferenceType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "60011"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Apartment Buildings—Garden—Products/Completed Operations are subject to the General Aggregate limit"
				},
				"limit": [{
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 200000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 100000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 827293,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 600000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 300000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 981863,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 500000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 165392,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 2000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 62839,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}],
				"programClassID": "512332",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.GeneralLiabilityClassificationReferenceType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "60015"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Apartment Hotels—less than four stories— Products/Completed Operations are subject to the General Aggregate limit"
				},
				"limit": [{
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 200000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 100000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 827293,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 600000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 300000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 981863,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 500000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 165392,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 2000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 62839,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}],
				"programClassID": "512336",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.GeneralLiabilityClassificationReferenceType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "60016"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Apartment Hotels—four stories or more—Products/Completed Operations are subject to the General Aggregate limit"
				},
				"limit": [{
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 200000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 100000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 827293,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 600000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 300000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 981863,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 500000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 165392,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 2000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 62839,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}],
				"programClassID": "512337",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.GeneralLiabilityClassificationReferenceType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "61000"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Boarding or Rooming Houses—Products/Completed Operations are subject to the General Aggregate limit"
				},
				"limit": [{
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 200000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 100000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 827293,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 600000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 300000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 981863,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 500000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 165392,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 2000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 62839,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}],
				"programClassID": "512425",
				"secondaryClassCd": null
			}, {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.GeneralLiabilityClassificationReferenceType",
				"classCd": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
					"value": "91591"
				},
				"classCdDesc": {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.C255",
					"value": "Contractors—subcontractors work other than construction"
				},
				"limit": [{
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 200000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 100000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 827293,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 600000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 300000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 981863,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 500000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 165392,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}, {
					"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.LimitType",
					"limitAggregateAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 2000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitAmt": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.FORMATTEDNUMBERNoID",
						"formatCurrencyAmt": {
							"amt": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.Decimal",
								"value": 1000000
							},
							"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.CURRENCY",
							"curCd": {
								"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
								"value": "Currency"
							}
						},
						"formatInteger": null,
						"formatModFactor": null,
						"formatPct": null,
						"formatText": null
					},
					"limitID": 62839,
					"limitType": {
						"class": "com.nationwide.scottsdale.schemas.productdevelopment.acord1.pc.programinfoinquiry_1.OpenEnum",
						"value": "Per Occurrence"
					}
				}],
				"programClassID": "726283",
				"secondaryClassCd": null
			}],
			"programInfo": {
				"class": "com.nationwide.scottsdale.schemas.productdevelopment.extension.programinfoinquiry_1.ProgramInfoType",
				"companyProductCd": "0079",
				"programName": "Apartment House Program"
			}
		}
	}
});
