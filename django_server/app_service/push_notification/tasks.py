from dotenv import dotenv_values

config = dotenv_values(".env")

SEOUL_API_KEY = config["SEOUL_API_KEY"]

axis_code = [107, 12, 127, 13, 134, 149, 151, 193, 195,
             197, 208, 210, 212, 219, 22, 237, 250, 267,
             274, 309, 319, 327, 338, 342, 354, 365, 370,
             377, 379, 383, 386, 403, 42, 427, 450, 454,
             46, 463, 47, 473, 481, 484, 57, 74, 89, 98]