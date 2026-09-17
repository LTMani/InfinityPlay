/**
 * CONNECTING Puzzle Game - 30 Verified Solvable Levels
 * Grids: 5x5 (1-5), 6x6 (6-12), 7x7 (13-20), 8x8 (21-26), 9x9 (27-30).
 * Every level is mathematically verified to cover 100% of cells without overlap or diagonal jumps.
 */

window.CONNECTING_LEVELS = [
  {
    "id": 1,
    "size": 5,
    "difficulty": "Beginner",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 1
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 3,
          "c": 1
        },
        "end": {
          "r": 4,
          "c": 3
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 2,
          "c": 4
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 2,
            "c": 1
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 4
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "size": 5,
    "difficulty": "Beginner",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 1,
          "c": 4
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 2,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 2
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 1,
          "c": 1
        },
        "end": {
          "r": 4,
          "c": 0
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 4,
          "c": 1
        },
        "end": {
          "r": 2,
          "c": 2
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      }
    ]
  },
  {
    "id": 3,
    "size": 5,
    "difficulty": "Beginner",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 1,
          "c": 3
        },
        "end": {
          "r": 3,
          "c": 4
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 2,
          "c": 4
        },
        "end": {
          "r": 0,
          "c": 3
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 2,
          "c": 0
        },
        "end": {
          "r": 1,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 4,
    "size": 5,
    "difficulty": "Beginner",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 2,
          "c": 2
        },
        "end": {
          "r": 3,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 2,
          "c": 3
        },
        "end": {
          "r": 4,
          "c": 1
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 0
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 1,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 3
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 3
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          }
        ]
      }
    ]
  },
  {
    "id": 5,
    "size": 5,
    "difficulty": "Beginner",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 0,
          "c": 0
        },
        "end": {
          "r": 0,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 0,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 2
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 2,
          "c": 2
        },
        "end": {
          "r": 3,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 2,
          "c": 1
        },
        "end": {
          "r": 3,
          "c": 0
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 4,
          "c": 0
        },
        "end": {
          "r": 3,
          "c": 3
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      }
    ]
  },
  {
    "id": 6,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 5
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 5,
          "c": 4
        },
        "end": {
          "r": 4,
          "c": 0
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 3,
          "c": 0
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 4,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 7,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 5,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 5,
          "c": 2
        },
        "end": {
          "r": 4,
          "c": 1
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 2
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 3,
          "c": 2
        },
        "end": {
          "r": 1,
          "c": 1
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 1,
          "c": 2
        },
        "end": {
          "r": 3,
          "c": 0
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          }
        ]
      }
    ]
  },
  {
    "id": 8,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 5,
          "c": 5
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 5,
          "c": 4
        },
        "end": {
          "r": 3,
          "c": 0
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 2,
          "c": 0
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 3,
          "c": 3
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 4,
          "c": 3
        },
        "end": {
          "r": 4,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 9,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 4,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 4,
          "c": 3
        },
        "end": {
          "r": 0,
          "c": 2
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 1,
          "c": 2
        },
        "end": {
          "r": 0,
          "c": 0
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 1,
          "c": 0
        },
        "end": {
          "r": 5,
          "c": 1
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 5,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 5
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 5,
            "c": 1
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      }
    ]
  },
  {
    "id": 10,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 1
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 5,
          "c": 0
        },
        "end": {
          "r": 2,
          "c": 0
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 1,
          "c": 0
        },
        "end": {
          "r": 1,
          "c": 3
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 1,
          "c": 2
        },
        "end": {
          "r": 0,
          "c": 4
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 5
        },
        "end": {
          "r": 5,
          "c": 4
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 4
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 4
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          }
        ]
      }
    ]
  },
  {
    "id": 11,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 5,
          "c": 1
        },
        "end": {
          "r": 2,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 3,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 5
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 5
        },
        "end": {
          "r": 3,
          "c": 4
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 0,
          "c": 5
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 4
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 0,
          "c": 0
        },
        "end": {
          "r": 3,
          "c": 0
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 0,
            "c": 5
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          }
        ]
      }
    ]
  },
  {
    "id": 12,
    "size": 6,
    "difficulty": "Easy",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 3,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 0
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 2,
          "c": 1
        },
        "end": {
          "r": 3,
          "c": 3
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 3
        },
        "end": {
          "r": 4,
          "c": 0
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 5,
          "c": 0
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 5
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 0,
          "c": 0
        },
        "end": {
          "r": 2,
          "c": 4
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          }
        ]
      }
    ]
  },
  {
    "id": 13,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 6
        },
        "end": {
          "r": 6,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 6,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 1
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 5,
          "c": 2
        },
        "end": {
          "r": 3,
          "c": 2
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 3,
          "c": 3
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 0
        },
        "end": {
          "r": 2,
          "c": 0
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          }
        ]
      }
    ]
  },
  {
    "id": 14,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 2,
          "c": 0
        },
        "end": {
          "r": 5,
          "c": 0
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 6,
          "c": 0
        },
        "end": {
          "r": 6,
          "c": 5
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 6,
          "c": 6
        },
        "end": {
          "r": 3,
          "c": 5
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 2,
          "c": 5
        },
        "end": {
          "r": 0,
          "c": 4
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 3
        },
        "end": {
          "r": 1,
          "c": 2
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 2,
          "c": 2
        },
        "end": {
          "r": 1,
          "c": 3
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 5
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 3,
            "c": 5
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 0,
            "c": 4
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 2
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          }
        ]
      }
    ]
  },
  {
    "id": 15,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 5,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 4,
          "c": 3
        },
        "end": {
          "r": 6,
          "c": 1
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 6,
          "c": 0
        },
        "end": {
          "r": 2,
          "c": 0
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 2,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 4
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 5
        },
        "end": {
          "r": 2,
          "c": 4
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 3,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 16,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 3,
          "c": 3
        },
        "end": {
          "r": 4,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 3,
          "c": 2
        },
        "end": {
          "r": 0,
          "c": 2
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 0,
          "c": 3
        },
        "end": {
          "r": 2,
          "c": 4
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 3,
          "c": 4
        },
        "end": {
          "r": 0,
          "c": 6
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 1,
          "c": 6
        },
        "end": {
          "r": 6,
          "c": 4
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 6,
          "c": 3
        },
        "end": {
          "r": 5,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 0,
            "c": 2
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 4
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 17,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 1,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 0
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 0,
          "c": 1
        },
        "end": {
          "r": 1,
          "c": 3
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 0,
          "c": 3
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 4,
          "c": 0
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 5,
          "c": 0
        },
        "end": {
          "r": 6,
          "c": 5
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 6,
          "c": 6
        },
        "end": {
          "r": 4,
          "c": 5
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 4,
          "c": 6
        },
        "end": {
          "r": 5,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 3
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 5
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 18,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 0,
          "c": 0
        },
        "end": {
          "r": 0,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 1,
          "c": 2
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 2,
          "c": 2
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 3,
          "c": 2
        },
        "end": {
          "r": 3,
          "c": 6
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 4,
          "c": 6
        },
        "end": {
          "r": 6,
          "c": 6
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 6,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 1
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 6,
          "c": 0
        },
        "end": {
          "r": 5,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 6
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 19,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 2,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 2,
          "c": 5
        },
        "end": {
          "r": 0,
          "c": 5
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 0,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 0,
          "c": 1
        },
        "end": {
          "r": 4,
          "c": 0
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 5,
          "c": 0
        },
        "end": {
          "r": 4,
          "c": 1
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 4,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 6
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 5,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 6
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 5
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 6
          }
        ]
      }
    ]
  },
  {
    "id": 20,
    "size": 7,
    "difficulty": "Medium",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 0
        },
        "end": {
          "r": 5,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 4,
          "c": 3
        },
        "end": {
          "r": 5,
          "c": 4
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 6,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 6
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 0,
          "c": 6
        },
        "end": {
          "r": 0,
          "c": 3
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 0
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 3,
          "c": 0
        },
        "end": {
          "r": 3,
          "c": 3
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 2,
          "c": 3
        },
        "end": {
          "r": 1,
          "c": 5
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 4
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 3
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 0
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      }
    ]
  },
  {
    "id": 21,
    "size": 8,
    "difficulty": "Hard",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 5,
          "c": 3
        },
        "end": {
          "r": 7,
          "c": 3
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 6,
          "c": 3
        },
        "end": {
          "r": 6,
          "c": 6
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 7,
          "c": 6
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 2,
          "c": 1
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 2,
          "c": 2
        },
        "end": {
          "r": 0,
          "c": 3
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 0,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 6
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 7,
            "c": 3
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 6
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          }
        ]
      }
    ]
  },
  {
    "id": 22,
    "size": 8,
    "difficulty": "Hard",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 6,
          "c": 1
        },
        "end": {
          "r": 4,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 3,
          "c": 2
        },
        "end": {
          "r": 1,
          "c": 0
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 0,
          "c": 0
        },
        "end": {
          "r": 3,
          "c": 3
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 3,
          "c": 4
        },
        "end": {
          "r": 0,
          "c": 6
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 7
        },
        "end": {
          "r": 7,
          "c": 5
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 7,
          "c": 6
        },
        "end": {
          "r": 5,
          "c": 5
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 7,
            "c": 5
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      }
    ]
  },
  {
    "id": 23,
    "size": 8,
    "difficulty": "Hard",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 6,
          "c": 3
        },
        "end": {
          "r": 6,
          "c": 0
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 5,
          "c": 0
        },
        "end": {
          "r": 4,
          "c": 3
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 4
        },
        "end": {
          "r": 2,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 2,
          "c": 2
        },
        "end": {
          "r": 0,
          "c": 5
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 6
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 7,
          "c": 6
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 7,
          "c": 5
        },
        "end": {
          "r": 5,
          "c": 3
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 7,
            "c": 6
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          }
        ]
      }
    ]
  },
  {
    "id": 24,
    "size": 8,
    "difficulty": "Hard",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 1,
          "c": 3
        },
        "end": {
          "r": 1,
          "c": 1
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 0,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 4
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 0,
          "c": 5
        },
        "end": {
          "r": 5,
          "c": 5
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 5,
          "c": 4
        },
        "end": {
          "r": 6,
          "c": 1
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 6,
          "c": 2
        },
        "end": {
          "r": 6,
          "c": 5
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 6,
          "c": 6
        },
        "end": {
          "r": 2,
          "c": 6
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 2,
          "c": 7
        },
        "end": {
          "r": 7,
          "c": 4
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 0,
            "c": 4
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 6,
            "c": 1
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 5
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 7,
            "c": 4
          }
        ]
      }
    ]
  },
  {
    "id": 25,
    "size": 8,
    "difficulty": "Hard",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 4,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 2,
          "c": 1
        },
        "end": {
          "r": 7,
          "c": 1
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 7,
          "c": 2
        },
        "end": {
          "r": 6,
          "c": 3
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 5,
          "c": 3
        },
        "end": {
          "r": 5,
          "c": 5
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 4,
          "c": 5
        },
        "end": {
          "r": 0,
          "c": 0
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 0,
          "c": 1
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 1,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 6
        }
      },
      {
        "id": "pink",
        "name": "Pink",
        "color": "#ec4899",
        "start": {
          "r": 0,
          "c": 6
        },
        "end": {
          "r": 4,
          "c": 7
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 7,
            "c": 1
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 6,
            "c": 3
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 5
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          }
        ]
      },
      {
        "colorId": "pink",
        "path": [
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          }
        ]
      }
    ]
  },
  {
    "id": 26,
    "size": 8,
    "difficulty": "Hard",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 2,
          "c": 0
        },
        "end": {
          "r": 3,
          "c": 2
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 4,
          "c": 2
        },
        "end": {
          "r": 2,
          "c": 2
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 2,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 4
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 5,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 4
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 6,
          "c": 3
        },
        "end": {
          "r": 7,
          "c": 7
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 6,
          "c": 7
        },
        "end": {
          "r": 1,
          "c": 5
        }
      },
      {
        "id": "pink",
        "name": "Pink",
        "color": "#ec4899",
        "start": {
          "r": 0,
          "c": 5
        },
        "end": {
          "r": 1,
          "c": 6
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 2
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 4
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 7,
            "c": 7
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          }
        ]
      },
      {
        "colorId": "pink",
        "path": [
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 1,
            "c": 6
          }
        ]
      }
    ]
  },
  {
    "id": 27,
    "size": 9,
    "difficulty": "Expert",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 1,
          "c": 7
        },
        "end": {
          "r": 5,
          "c": 6
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 4,
          "c": 6
        },
        "end": {
          "r": 2,
          "c": 5
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 3,
          "c": 5
        },
        "end": {
          "r": 0,
          "c": 4
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 0,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 7
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 6,
          "c": 6
        },
        "end": {
          "r": 2,
          "c": 2
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 2,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 0
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 1,
          "c": 0
        },
        "end": {
          "r": 7,
          "c": 1
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 5,
            "c": 6
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 0,
            "c": 8
          },
          {
            "r": 1,
            "c": 8
          },
          {
            "r": 2,
            "c": 8
          },
          {
            "r": 3,
            "c": 8
          },
          {
            "r": 4,
            "c": 8
          },
          {
            "r": 5,
            "c": 8
          },
          {
            "r": 6,
            "c": 8
          },
          {
            "r": 7,
            "c": 8
          },
          {
            "r": 8,
            "c": 8
          },
          {
            "r": 8,
            "c": 7
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 8,
            "c": 6
          },
          {
            "r": 8,
            "c": 5
          },
          {
            "r": 8,
            "c": 4
          },
          {
            "r": 8,
            "c": 3
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 0
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 8,
            "c": 0
          },
          {
            "r": 8,
            "c": 1
          },
          {
            "r": 8,
            "c": 2
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 7,
            "c": 1
          }
        ]
      }
    ]
  },
  {
    "id": 28,
    "size": 9,
    "difficulty": "Expert",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 8,
          "c": 2
        },
        "end": {
          "r": 6,
          "c": 0
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 5,
          "c": 0
        },
        "end": {
          "r": 3,
          "c": 1
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 1
        },
        "end": {
          "r": 0,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 1,
          "c": 1
        },
        "end": {
          "r": 3,
          "c": 5
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 4,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 8
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 7,
          "c": 8
        },
        "end": {
          "r": 5,
          "c": 6
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 5,
          "c": 5
        },
        "end": {
          "r": 8,
          "c": 5
        }
      },
      {
        "id": "pink",
        "name": "Pink",
        "color": "#ec4899",
        "start": {
          "r": 7,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 4
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 8,
            "c": 2
          },
          {
            "r": 8,
            "c": 1
          },
          {
            "r": 8,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 6,
            "c": 0
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 1
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 0,
            "c": 8
          },
          {
            "r": 1,
            "c": 8
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 3,
            "c": 5
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 2,
            "c": 8
          },
          {
            "r": 3,
            "c": 8
          },
          {
            "r": 4,
            "c": 8
          },
          {
            "r": 5,
            "c": 8
          },
          {
            "r": 6,
            "c": 8
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 7,
            "c": 8
          },
          {
            "r": 8,
            "c": 8
          },
          {
            "r": 8,
            "c": 7
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 5,
            "c": 6
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 8,
            "c": 6
          },
          {
            "r": 8,
            "c": 5
          }
        ]
      },
      {
        "colorId": "pink",
        "path": [
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 8,
            "c": 4
          },
          {
            "r": 8,
            "c": 3
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 4
          }
        ]
      }
    ]
  },
  {
    "id": 29,
    "size": 9,
    "difficulty": "Expert",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 7,
          "c": 3
        },
        "end": {
          "r": 7,
          "c": 6
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 7,
          "c": 7
        },
        "end": {
          "r": 6,
          "c": 6
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 6,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 1
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 6,
          "c": 0
        },
        "end": {
          "r": 0,
          "c": 0
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 0,
          "c": 1
        },
        "end": {
          "r": 3,
          "c": 3
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 3,
          "c": 4
        },
        "end": {
          "r": 1,
          "c": 2
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 0,
          "c": 2
        },
        "end": {
          "r": 5,
          "c": 8
        }
      },
      {
        "id": "pink",
        "name": "Pink",
        "color": "#ec4899",
        "start": {
          "r": 4,
          "c": 8
        },
        "end": {
          "r": 2,
          "c": 6
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 8,
            "c": 3
          },
          {
            "r": 8,
            "c": 4
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 8,
            "c": 5
          },
          {
            "r": 8,
            "c": 6
          },
          {
            "r": 7,
            "c": 6
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 8,
            "c": 7
          },
          {
            "r": 8,
            "c": 8
          },
          {
            "r": 7,
            "c": 8
          },
          {
            "r": 6,
            "c": 8
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 6,
            "c": 6
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 6,
            "c": 5
          },
          {
            "r": 6,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 8,
            "c": 2
          },
          {
            "r": 8,
            "c": 1
          },
          {
            "r": 8,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 6,
            "c": 1
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 3,
            "c": 3
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 1,
            "c": 2
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 5,
            "c": 8
          }
        ]
      },
      {
        "colorId": "pink",
        "path": [
          {
            "r": 4,
            "c": 8
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 3,
            "c": 8
          },
          {
            "r": 2,
            "c": 8
          },
          {
            "r": 1,
            "c": 8
          },
          {
            "r": 0,
            "c": 8
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 2,
            "c": 6
          }
        ]
      }
    ]
  },
  {
    "id": 30,
    "size": 9,
    "difficulty": "Expert",
    "pairs": [
      {
        "id": "red",
        "name": "Red",
        "color": "#ef4444",
        "start": {
          "r": 1,
          "c": 1
        },
        "end": {
          "r": 2,
          "c": 8
        }
      },
      {
        "id": "blue",
        "name": "Blue",
        "color": "#3b82f6",
        "start": {
          "r": 3,
          "c": 8
        },
        "end": {
          "r": 3,
          "c": 6
        }
      },
      {
        "id": "green",
        "name": "Green",
        "color": "#10b981",
        "start": {
          "r": 4,
          "c": 6
        },
        "end": {
          "r": 6,
          "c": 8
        }
      },
      {
        "id": "yellow",
        "name": "Yellow",
        "color": "#f59e0b",
        "start": {
          "r": 7,
          "c": 8
        },
        "end": {
          "r": 6,
          "c": 5
        }
      },
      {
        "id": "purple",
        "name": "Purple",
        "color": "#8b5cf6",
        "start": {
          "r": 7,
          "c": 5
        },
        "end": {
          "r": 6,
          "c": 4
        }
      },
      {
        "id": "orange",
        "name": "Orange",
        "color": "#f97316",
        "start": {
          "r": 6,
          "c": 3
        },
        "end": {
          "r": 3,
          "c": 5
        }
      },
      {
        "id": "cyan",
        "name": "Cyan",
        "color": "#06b6d4",
        "start": {
          "r": 2,
          "c": 5
        },
        "end": {
          "r": 1,
          "c": 2
        }
      },
      {
        "id": "pink",
        "name": "Pink",
        "color": "#ec4899",
        "start": {
          "r": 2,
          "c": 2
        },
        "end": {
          "r": 7,
          "c": 0
        }
      },
      {
        "id": "silver",
        "name": "Silver",
        "color": "#94a3b8",
        "start": {
          "r": 8,
          "c": 0
        },
        "end": {
          "r": 8,
          "c": 2
        }
      }
    ],
    "solution": [
      {
        "colorId": "red",
        "path": [
          {
            "r": 1,
            "c": 1
          },
          {
            "r": 1,
            "c": 0
          },
          {
            "r": 0,
            "c": 0
          },
          {
            "r": 0,
            "c": 1
          },
          {
            "r": 0,
            "c": 2
          },
          {
            "r": 0,
            "c": 3
          },
          {
            "r": 0,
            "c": 4
          },
          {
            "r": 1,
            "c": 4
          },
          {
            "r": 1,
            "c": 5
          },
          {
            "r": 0,
            "c": 5
          },
          {
            "r": 0,
            "c": 6
          },
          {
            "r": 1,
            "c": 6
          },
          {
            "r": 1,
            "c": 7
          },
          {
            "r": 0,
            "c": 7
          },
          {
            "r": 0,
            "c": 8
          },
          {
            "r": 1,
            "c": 8
          },
          {
            "r": 2,
            "c": 8
          }
        ]
      },
      {
        "colorId": "blue",
        "path": [
          {
            "r": 3,
            "c": 8
          },
          {
            "r": 3,
            "c": 7
          },
          {
            "r": 2,
            "c": 7
          },
          {
            "r": 2,
            "c": 6
          },
          {
            "r": 3,
            "c": 6
          }
        ]
      },
      {
        "colorId": "green",
        "path": [
          {
            "r": 4,
            "c": 6
          },
          {
            "r": 4,
            "c": 7
          },
          {
            "r": 4,
            "c": 8
          },
          {
            "r": 5,
            "c": 8
          },
          {
            "r": 6,
            "c": 8
          }
        ]
      },
      {
        "colorId": "yellow",
        "path": [
          {
            "r": 7,
            "c": 8
          },
          {
            "r": 8,
            "c": 8
          },
          {
            "r": 8,
            "c": 7
          },
          {
            "r": 7,
            "c": 7
          },
          {
            "r": 6,
            "c": 7
          },
          {
            "r": 5,
            "c": 7
          },
          {
            "r": 5,
            "c": 6
          },
          {
            "r": 6,
            "c": 6
          },
          {
            "r": 6,
            "c": 5
          }
        ]
      },
      {
        "colorId": "purple",
        "path": [
          {
            "r": 7,
            "c": 5
          },
          {
            "r": 7,
            "c": 6
          },
          {
            "r": 8,
            "c": 6
          },
          {
            "r": 8,
            "c": 5
          },
          {
            "r": 8,
            "c": 4
          },
          {
            "r": 8,
            "c": 3
          },
          {
            "r": 7,
            "c": 3
          },
          {
            "r": 7,
            "c": 4
          },
          {
            "r": 6,
            "c": 4
          }
        ]
      },
      {
        "colorId": "orange",
        "path": [
          {
            "r": 6,
            "c": 3
          },
          {
            "r": 6,
            "c": 2
          },
          {
            "r": 6,
            "c": 1
          },
          {
            "r": 5,
            "c": 1
          },
          {
            "r": 5,
            "c": 2
          },
          {
            "r": 5,
            "c": 3
          },
          {
            "r": 4,
            "c": 3
          },
          {
            "r": 3,
            "c": 3
          },
          {
            "r": 3,
            "c": 4
          },
          {
            "r": 4,
            "c": 4
          },
          {
            "r": 5,
            "c": 4
          },
          {
            "r": 5,
            "c": 5
          },
          {
            "r": 4,
            "c": 5
          },
          {
            "r": 3,
            "c": 5
          }
        ]
      },
      {
        "colorId": "cyan",
        "path": [
          {
            "r": 2,
            "c": 5
          },
          {
            "r": 2,
            "c": 4
          },
          {
            "r": 2,
            "c": 3
          },
          {
            "r": 1,
            "c": 3
          },
          {
            "r": 1,
            "c": 2
          }
        ]
      },
      {
        "colorId": "pink",
        "path": [
          {
            "r": 2,
            "c": 2
          },
          {
            "r": 3,
            "c": 2
          },
          {
            "r": 4,
            "c": 2
          },
          {
            "r": 4,
            "c": 1
          },
          {
            "r": 3,
            "c": 1
          },
          {
            "r": 2,
            "c": 1
          },
          {
            "r": 2,
            "c": 0
          },
          {
            "r": 3,
            "c": 0
          },
          {
            "r": 4,
            "c": 0
          },
          {
            "r": 5,
            "c": 0
          },
          {
            "r": 6,
            "c": 0
          },
          {
            "r": 7,
            "c": 0
          }
        ]
      },
      {
        "colorId": "silver",
        "path": [
          {
            "r": 8,
            "c": 0
          },
          {
            "r": 8,
            "c": 1
          },
          {
            "r": 7,
            "c": 1
          },
          {
            "r": 7,
            "c": 2
          },
          {
            "r": 8,
            "c": 2
          }
        ]
      }
    ]
  }
];
