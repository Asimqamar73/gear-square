import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";

const CardV2 = ({ cardTitle, cardDescription }: { cardTitle: string; cardDescription: string }) => {
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardDescription className="text-md">{cardDescription}</CardDescription>
        <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
          {cardTitle}
        </CardTitle>
        {/* <CardAction>
            <Badge variant="outline">
              <TrendingUp />
              +12.5%
            </Badge>
          </CardAction> */}
      </CardHeader>
      {/* <CardFooter className="flex-col items-start gap-1.5 text-sm">
        <div className="line-clamp-1 flex gap-2 font-medium">
          Trending up this month <TrendingUp className="size-4" />
        </div>
        <div className="text-muted-foreground">Visitors for the last 6 months</div>
      </CardFooter> */}
    </Card>
  );
};

export default CardV2;
